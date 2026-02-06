---
layout: post
title: "Spring Boot REST API 설계 가이드"
date: 2025-02-01
tags: [spring, backend, rest-api]
categories: [spring]
---

Spring Boot로 깔끔한 REST API를 설계하는 방법을 정리합니다.

## 프로젝트 구조

```
src/main/java/
├── controller/    # API 엔드포인트
├── service/       # 비즈니스 로직
├── repository/    # 데이터 접근 계층
├── domain/        # 엔티티
└── dto/           # 요청/응답 DTO
```

## Controller 패턴

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> findById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(userService.findById(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(
            @Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response));
    }
}
```

## DTO 설계 — Record 활용

Java 14+ Record를 사용하면 불변 DTO를 간결하게 작성할 수 있습니다.

```java
public record UserCreateRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    @NotBlank @Size(min = 2, max = 50) String name
) {}

public record UserResponse(
    Long id,
    String email,
    String name,
    LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getCreatedAt()
        );
    }
}
```

## 통일된 응답 포맷

```java
public record ApiResponse<T>(
    boolean success,
    T data,
    String error
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```

## 에러 핸들링

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(
            UserNotFoundException e) {
        log.warn("User not found: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(e.getMessage()));
    }
}
```

## 핵심 원칙

1. **불변성** — DTO는 Record, 엔티티는 Builder 패턴
2. **입력 검증** — Bean Validation 활용
3. **계층 분리** — Controller → Service → Repository
4. **일관된 응답** — ApiResponse 래퍼 사용
5. **의미있는 HTTP 상태 코드** — 201 Created, 404 Not Found 등

이 패턴을 기반으로 확장하면 유지보수하기 좋은 API를 만들 수 있습니다.
