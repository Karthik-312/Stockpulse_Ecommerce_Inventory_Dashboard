package com.stockpulse.ecommerce.service;

import com.stockpulse.ecommerce.dto.InventoryItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class StockPulseClient {
    private static final Logger log = LoggerFactory.getLogger(StockPulseClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public StockPulseClient(RestTemplate restTemplate,
                            @Value("${stockpulse.api.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public List<InventoryItemDTO> getAllInventoryItems() {
        log.info("Fetching all inventory items from StockPulse API");
        InventoryItemDTO[] items = restTemplate.getForObject(
                baseUrl + "/api/inventory", InventoryItemDTO[].class);
        return items != null ? Arrays.asList(items) : List.of();
    }

    public InventoryItemDTO getInventoryItem(Long id) {
        log.info("Fetching inventory item {} from StockPulse API", id);
        return restTemplate.getForObject(
                baseUrl + "/api/inventory/" + id, InventoryItemDTO.class);
    }

    public void adjustStock(Long itemId, int delta) {
        log.info("Adjusting stock for item {} by delta {}", itemId, delta);
        restTemplate.postForObject(
                baseUrl + "/api/inventory/" + itemId + "/adjust?delta=" + delta,
                null, String.class);
    }
}
