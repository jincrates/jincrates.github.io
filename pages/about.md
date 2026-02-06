---
layout: default
title: About
permalink: /about/
command: /about
ai_greeting: "Let me introduce the developer behind this blog:"
---

{% assign now_year = "now" | date: "%Y" | plus: 0 %}
{% assign now_month = "now" | date: "%m" | plus: 0 %}
{% assign total_months = now_year | minus: 2020 | times: 12 | plus: now_month | minus: 6 %}
{% assign exp_years = total_months | divided_by: 12 %}
{% assign exp_months = total_months | modulo: 12 %}

## 진크(Jincrates/이진규)

**Backend Developer**

철학을 전공하고 개발의 세계로 전향한 백엔드 개발자({{ exp_years }}년{% if exp_months > 0 %} {{ exp_months }}개월{% endif %}, 2020.06~)입니다. 레거시 시스템 마이그레이션과 결제 시스템 설계 경험을 바탕으로, 안정적이고 확장 가능한 서비스를 만들어갑니다.

- **GitHub**: [github.com/jincrates](https://github.com/jincrates)
- **Blog**: [jincrates.github.io](https://jincrates.github.io)

---

## Tech Stack

- **Language**: `Java`, `Kotlin`
- **Framework**: `Spring Boot`, `Spring Data JPA`, `QueryDSL`
- **Database**: `MariaDB`, `PostgreSQL`, `Redis`
- **DevOps**: `Docker`, `GitHub Actions`, `AWS`
- **Others**: `Kafka`, `Git`, `REST API`, `nGrinder`, `K6`

---

## Experience

### (주)펫프렌즈 — 주문결제팀 백엔드 개발자

`2022.10 - present`

주문결제팀에서 신규 기능 개발 및 레거시 마이그레이션 담당. Node.js 기반 레거시를 Java/Spring Boot로 전환하며, PG 결제 구조 설계 및 교환반품 시스템을 신규 구축. 사내 기술블로그 위원장으로 팀 내 기술 공유 문화를 주도.

**기술블로그**: [코드로 아키텍처 원칙을 지키는 방법(feat.ArchUnit)](https://techblog.pet-friends.co.kr/archunit%EC%9C%BC%EB%A1%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%EC%9B%90%EC%B9%99%EC%9D%84-%EC%BD%94%EB%93%9C%EB%A1%9C-%EC%A7%80%ED%82%A4%EB%8A%94-%EB%B0%A9%EB%B2%95-b6731a038189)

**교환반품 기능 개발** `2023.08 - 2024.02`
- `Java 11`, `Spring Boot 2.3`, `QueryDSL`, `MariaDB`
- 교환반품 도메인 테이블/인덱스 설계 및 전체 프로세스 신규 구축
- 상품별 수량 단위 접수 처리 및 추가배송비 PG 결제 연동
- 수거송장/재배송장 WMS 연동으로 물류 자동화, 카카오톡 알림톡 발송
- `ngrinder`, `k6` 성능 테스트를 통해 목표 TPS 달성 및 병목 개선

**주문결제 마이그레이션 (Node → Java)** `2023.01 - 2023.07`
- `Node 10` → `Java 11`, `Spring Boot`, `QueryDSL`, `Redis`, `MariaDB`
- 주문준비/주문완료 API를 Java로 이관하여 유지보수성 향상
- 결제수단 인터페이스화를 통한 공통 관리 구조 설계로 신규 PG 추가 용이하게 개선
- `ngrinder` 주문결제 성능테스트로 기존 대비 응답속도 개선 확인

**내통장결제(헥토파이낸셜) 연동** `2022.11 - 2022.12`
- `Node.js`, `MariaDB`
- 신규 결제수단 API 분리 및 추가 포인트 적립 로직 구현
- 은행점검 시간대 에러 핸들링으로 사용자 경험 개선

---

### 이든비즈텍(주) — 그룹웨어 개발자

`2020.06 - 2022.09`

제조, 금융/법무, IT/유통 등 약 180여 업체의 그룹웨어 추가개발 및 유지보수 담당. 노션을 활용한 사내 업무 문서화 시스템을 구축하여 반복 요청 대응 시간 단축.

**그룹웨어 기능개선** `2020.06 - 2022.08`
- `C#`, `ASP.NET 4.7`, `MSSQL`
- 메인 포틀릿 바인딩 속도 개선 — 프로시저 정리 및 Index 재생성으로 로딩 시간 단축
- 반복 요청 패턴 분석 후 기능화하여 운영 효율 개선

**파고다교육그룹** `2021.11 - 2022.04`
- `C#`, `ASP.NET`, `MSSQL`
- ERP 조직도/회계전표/전자결재 연동 개발
- SQL Agent 자정 동기화 스케줄 및 근무그룹 관리 기능 구현

**제노코** `2021.07 - 2021.12`
- `C#`, `ASP.NET`, `MSSQL`
- 입사일 기준 연차생성, 근태마감, 출퇴근 연동 시스템 개발
- 연장근무 관리 및 SAP 연동, 계측기 자원 WCMS 연동

**티웨이항공** `2021.05 - 2021.06`
- `C#`, `ASP.NET`, `MSSQL`
- 외부메일 포워딩 제한관리 개발 — 관리자 페이지에서 전사 메일 포워딩 정책 관리

---

## Projects

### 지호락(Jihorak)
**태그 기반 스터디 관리 서비스**

- `Java 17`, `Spring Boot 2.7`, `MySQL`, `AWS EC2`
- 관심사/지역 태그 기반 스터디 개설 및 모집 기능
- 이메일/웹 알림 시스템으로 실시간 참여 관리
- REST API 설계 및 배포 자동화 경험

### 고북고북(Gobook)
**JPA 기반 북쇼핑몰**

- `Java 11`, `Spring Boot 2.6`, `MySQL`
- 상품 CRUD, 재고관리, 장바구니, 일괄결제/취소 구현
- JPA 연관관계 설계 및 주문-결제 도메인 모델링 학습

### 진스페이스(Jinspace)
**개인 블로그**

- `Java 11`, `Spring Boot 2.6`, `MySQL`, `AWS EC2`
- OAuth 2.0 소셜 로그인 연동 (Google, Naver, Kakao)
- Spring Security 기반 인증/인가 구조 학습

---

## Education & License

### 정보처리기사
- **한국산업인력공단** `2022.06`

### KH정보교육원
- **[NCS] 웹기반 응용 SW 개발자 양성과정 (JAVA, 7개월)** `2019.10 - 2020.05`

### 감리교신학대학교
- **종교철학전공** `2013.03 - 2019.02`
- 수석 졸업 (GPA 3.89 / 4.0)

---

> "Programmo ergo sum." — 나는 프로그래밍한다, 고로 존재한다.
