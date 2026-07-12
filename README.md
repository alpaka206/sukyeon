# Sukyeon

Next.js 기반의 수연테크 공개 사이트와 Sanity 연동 관리자 화면입니다.

## 로컬 실행

1. `.env.example`을 참고해 `.env.local`을 만들고 필요한 값을 설정합니다. 실제 비밀값은 저장소에 커밋하지 않습니다.
2. 의존성을 설치하고 개발 서버를 시작합니다.

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 개발 서버는 로컬 확인을 위해 `localhost:3000`에 바인딩됩니다.

## 서비스 전 점검

배포 후보와 동일한 커밋 및 환경 설정에서 다음 명령을 실행합니다.

| 명령 | 점검 내용 |
| --- | --- |
| `npm test` | 인증, 콘텐츠 어댑터, 보안 헤더, 폰트 전달 등 회귀 테스트 |
| `npm run typecheck` | TypeScript 정적 타입 검사 |
| `npm run doctor` | 고정 버전의 로컬 `react-doctor` 진단 결과(JSON) |
| `npm run check` | 테스트, 타입 검사, ESLint를 순서대로 실행하는 기본 품질 게이트 |
| `npm run build` | 실제 운영용 Next.js 빌드 |

`npm run doctor`는 진단 보고서이므로 발견 항목을 검토해야 합니다. 서비스 준비 완료 판정에는 최소한 `npm run check`와 `npm run build`의 성공이 필요합니다.

## Sanity 동작 및 장애 처리

`NEXT_PUBLIC_SANITY_PROJECT_ID`를 설정하지 않으면 Sanity 읽기 기능이 의도적으로 비활성화됩니다. 이 경우 목록은 빈 배열, 단일 페이지는 `null`, 카탈로그는 빈 기본 객체를 반환합니다. 로컬 JSON 콘텐츠로 대체하지 않습니다.

프로젝트 ID가 설정되어 Sanity가 활성화된 상태에서 네트워크, 권한 또는 Sanity API 오류가 발생하면 오류를 빈 콘텐츠로 바꾸지 않고 호출자와 빌드에 그대로 전달합니다. 따라서 Sanity가 구성된 운영 빌드의 실패를 정상적인 빈 사이트로 간주하면 안 됩니다. 읽기 이미지 최적화까지 사용하려면 `NEXT_PUBLIC_SANITY_PROJECT_ID`와 `NEXT_PUBLIC_SANITY_DATASET`을 모두 설정합니다.

관리자 로그인과 콘텐츠 쓰기에는 `SANITY_API_WRITE_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`이 모두 필요합니다. 쓰기 토큰과 관리자 값은 서버 환경에만 두고 로그, 이슈, 점검 증거에 기록하지 않습니다.

운영 편집 화면은 배포된 사이트의 `/admin/login`과 `/admin/content`입니다. `/studio`는 이전 주소 호환을 위해 `/admin/content`로 리디렉션되며, 별도 외부 편집 사이트를 배포하거나 운영하지 않습니다. 로컬 운영 문서도 이 인앱 관리자 경로를 기준으로 유지합니다.

## 관리자 인증 및 네트워크 방어

관리자 세션은 12시간 만료 HMAC 쿠키입니다. 서명 키가 현재 관리자 사용자명과 비밀번호에도 결합되므로 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` 중 하나를 교체하면 기존 세션이 즉시 무효화됩니다. 자격 증명 교체 뒤에는 관리자가 다시 로그인해야 합니다.

내장 로그인 실패 제어는 `/admin/login`에 대한 네트워크 단위 방어를 대신하지 않습니다. 운영 환경에서는 신뢰할 수 있는 CDN, WAF 또는 역방향 프록시에서 이 경로에 필수 요청 속도 제한을 적용해야 합니다. 애플리케이션은 클라이언트가 위조할 수 있는 `X-Forwarded-For` 및 유사 전달 헤더를 신뢰하지 않으며, 자체적으로 IP별 분산 속도 제한을 제공한다고 가정해서는 안 됩니다.

## 보안 헤더와 CSP

모든 경로에 CSP, HSTS, 클릭재킹 방지, MIME 스니핑 방지, Referrer Policy, Permissions Policy가 적용되며 `X-Powered-By`는 노출하지 않습니다.

현재 CSP는 정적 Next.js 렌더링과 인라인 부트스트랩·스타일의 호환성을 위해 `script-src`와 `style-src`에 `'unsafe-inline'`을 유지합니다. 이는 nonce 또는 해시 기반 정책보다 인라인 삽입 방어가 약한 잔여 위험입니다. CSP를 완화하거나 외부 출처를 추가하지 말고, 향후 nonce 기반 동적 렌더링으로 전환할 때 이 예외를 제거할 수 있는지 다시 검토합니다. 개발 서버에서만 Next.js 도구 호환을 위해 `script-src 'unsafe-eval'`이 추가됩니다.

## Pretendard 폰트

Pretendard Variable dynamic subset은 런타임 CDN 없이 같은 출처에서 제공합니다.

- 고정 버전: `pretendard@1.3.9`
- CSS: `src/app/pretendard.css`
- 폰트: `public/fonts/pretendard/v1.3.9/woff2-dynamic-subset/`
- 원본 출처 및 복사 내역: `public/fonts/pretendard/v1.3.9/PROVENANCE.md`
- SIL Open Font License 1.1: `public/fonts/pretendard/v1.3.9/LICENSE.txt`

폰트를 갱신할 때는 패키지 버전, 바이너리, CSS URL, 출처 기록, 라이선스를 함께 갱신하고 `npm test`와 `npm run build`로 같은 출처 전달을 다시 확인합니다.

개발용 React 진단 도구를 잠시 끄려면 로컬 환경에 `NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS=1`을 설정합니다. 이 도구들은 운영 번들에 포함되지 않아야 합니다.
