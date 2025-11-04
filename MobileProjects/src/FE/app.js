const host = window.location.hostname;   // ← 자동으로 현재 주소의 호스트만 가져옴
const API = `http://${host}:8080`;       // ← Spring 포트만 붙임

fetch(`${API}/api/hello`)
    .then(r => r.text())
    .then(t => document.getElementById("msg").textContent = t)
    .catch(() => document.getElementById("msg").textContent = "API 연결 실패");
