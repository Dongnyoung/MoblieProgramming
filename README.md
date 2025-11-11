# MoblieProgramming

# 📍 위치 공유 시스템 (Spring Boot + WebSocket + Ngrok)

이 프로젝트는 사용자의 위치를 지도에 표시하고, 여러 사용자가 접속했을 때 서로의 위치를 실시간으로 공유할 수 있는 시스템입니다.  
Spring Boot를 백엔드로 사용하고, ngrok을 통해 외부에서도 접속할 수 있도록 설정합니다.

---

## 실행 방법

### 1. 프로젝트 클론
```bash
git clone <레포지토리 URL>
cd <프로젝트 폴더>
```
### 2. Spring Boot 실행
```bash
./gradlew bootRun
```

### 3. ngrok 실행
```bash
ngrok http 8080
```

### 4. Forwarding주소 공유
```bash
예시)
Forwarding  https://xxxx-xx-xx-xx.ngrok-free.app
```