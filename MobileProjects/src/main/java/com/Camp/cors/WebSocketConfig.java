package com.Camp.cors;

import com.Camp.controller.WebSocketController;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final WebSocketController handler;
    @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry reg) {
        reg.addHandler(handler, "/tracking").setAllowedOrigins("*");
    }
}