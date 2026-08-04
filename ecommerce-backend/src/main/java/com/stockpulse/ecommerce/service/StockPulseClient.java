package com.stockpulse.ecommerce.service;

import com.stockpulse.ecommerce.dto.InventoryItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockPulseClient {
    private static final Logger log = LoggerFactory.getLogger(StockPulseClient.class);

    private static final long CACHE_TTL_MS = 5 * 60 * 1000;
    private static final int MAX_RETRIES = 2;
    private static final long RETRY_DELAY_MS = 3000;

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;

    private volatile List<InventoryItemDTO> cachedItems;
    private volatile long cacheTimestamp;
    private final ConcurrentHashMap<Long, InventoryItemDTO> itemCache = new ConcurrentHashMap<>();

    public StockPulseClient(RestTemplate restTemplate,
                            @Value("${stockpulse.api.base-url}") String baseUrl,
                            @Value("${stockpulse.api.key:}") String apiKey) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        log.info("StockPulse API configured at: {}", baseUrl);
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (apiKey != null && !apiKey.isBlank()) {
            headers.set("X-Api-Key", apiKey);
        }
        return headers;
    }

    public List<InventoryItemDTO> getAllInventoryItems() {
        if (cachedItems != null && (System.currentTimeMillis() - cacheTimestamp) < CACHE_TTL_MS) {
            log.debug("Returning {} cached inventory items", cachedItems.size());
            return cachedItems;
        }

        for (int attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                log.info("Fetching all inventory items from StockPulse API (attempt {})", attempt + 1);
                HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
                ResponseEntity<InventoryItemDTO[]> response = restTemplate.exchange(
                        baseUrl + "/api/inventory", HttpMethod.GET, entity, InventoryItemDTO[].class);
                InventoryItemDTO[] items = response.getBody();
                List<InventoryItemDTO> result = items != null ? Arrays.asList(items) : List.of();

                cachedItems = result;
                cacheTimestamp = System.currentTimeMillis();
                result.forEach(item -> itemCache.put(item.id(), item));
                log.info("Fetched and cached {} inventory items", result.size());

                return result;
            } catch (Exception e) {
                log.warn("Fetch attempt {} failed: {}", attempt + 1, e.getMessage());
                if (attempt < MAX_RETRIES) {
                    sleep(RETRY_DELAY_MS * (attempt + 1));
                } else if (cachedItems != null) {
                    log.warn("Returning stale cache after all retries failed");
                    return cachedItems;
                } else {
                    throw new RuntimeException("Failed to fetch inventory from StockPulse API", e);
                }
            }
        }
        return List.of();
    }

    public InventoryItemDTO getInventoryItem(Long id) {
        InventoryItemDTO cached = itemCache.get(id);
        if (cached != null && (System.currentTimeMillis() - cacheTimestamp) < CACHE_TTL_MS) {
            log.debug("Returning cached inventory item {}", id);
            return cached;
        }

        try {
            log.info("Fetching inventory item {} from StockPulse API", id);
            HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
            ResponseEntity<InventoryItemDTO> response = restTemplate.exchange(
                    baseUrl + "/api/inventory/" + id, HttpMethod.GET, entity, InventoryItemDTO.class);
            InventoryItemDTO item = response.getBody();
            if (item != null) {
                itemCache.put(id, item);
            }
            return item;
        } catch (Exception e) {
            if (cached != null) {
                log.warn("Returning stale cache for item {} after fetch failure", id);
                return cached;
            }
            throw new RuntimeException("Failed to fetch inventory item " + id, e);
        }
    }

    public void adjustStock(Long itemId, int delta) {
        log.info("Adjusting stock for item {} by delta {}", itemId, delta);
        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        restTemplate.exchange(
                baseUrl + "/api/inventory/" + itemId + "/adjust?delta=" + delta,
                HttpMethod.POST, entity, String.class);
        itemCache.remove(itemId);
        cachedItems = null;
    }

    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
