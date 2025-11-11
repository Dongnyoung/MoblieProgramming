function initMap() {
    const container = document.getElementById("map");
    const center = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(container, { center, level: 4 });

    // 내 마커
    const myMarker = new kakao.maps.Marker({ position: center });
    myMarker.setMap(map);

    // 다른 사람 마커: sessionId → Marker
    const others = new Map();

    // ===== WebSocket 연결 =====
    const ws = connectWS({
        userId: "user-" + Math.random().toString(36).slice(2,6), // 데모용
        postId: "room-1",                                        // 같은 방끼리만 보이게
        onJoinAck: (msg) => { ws.sessionId = msg.sessionId; },
        onLocation: (msg) => {
            const { sessionId, lat, lng } = msg;
            if (lat == null || lng == null) return;
            const pos = new kakao.maps.LatLng(lat, lng);

            // 내 세션이면 내 마커만 이동
            if (ws.sessionId && sessionId === ws.sessionId) {
                myMarker.setPosition(pos);
                map.setCenter(pos);
                return;
            }
            // 타인 마커 갱신/생성
            if (!others.has(sessionId)) {
                const m = new kakao.maps.Marker({ position: pos });
                m.setMap(map);
                others.set(sessionId, m);
            } else {
                others.get(sessionId).setPosition(pos);
            }
        }
    });

    // ===== 내 위치를 주기적으로 서버에 전송 =====
    if (navigator.geolocation) {
        let last = 0; const MIN = 800; // 0.8초 스로틀
        navigator.geolocation.watchPosition((pos) => {
            const now = Date.now(); if (now - last < MIN) return; last = now;

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // 즉시 화면 반영
            const me = new kakao.maps.LatLng(lat, lng);
            myMarker.setPosition(me);
            map.setCenter(me);

            // 서버로 전송
            ws.sendLoc(lat, lng);
        }, (err) => console.log("GPS 실패:", err), { enableHighAccuracy: true });
    } else {
        alert("이 브라우저는 위치 추적을 지원하지 않습니다.");
    }
}
window.initMap = initMap;

// ===== WebSocket Helper =====
function connectWS({ userId, postId, onJoinAck, onLocation }) {
    const loc = new URL(window.location.href);
    const wsProto = loc.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProto}//${loc.host}/tracking`;   // 스프링 설정과 동일 경로

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", userId, postId }));
    };

    ws.onmessage = (ev) => {
        try {
            const msg = JSON.parse(ev.data);
            if (msg.type === "join") onJoinAck && onJoinAck(msg);
            if (msg.type === "loc")  onLocation && onLocation(msg);
        } catch (e) {
            console.log("WS parse error:", e);
        }
    };

    ws.onerror = (e) => console.log("WS error:", e);
    ws.onclose  = () => console.log("WS closed");

    ws.sendLoc = (lat, lng) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "loc", lat, lng }));
        }
    };

    return ws;
}
