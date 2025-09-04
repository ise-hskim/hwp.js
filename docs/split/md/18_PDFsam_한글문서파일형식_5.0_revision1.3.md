# 한글 문서 파일 형식 5.0

### 3.2.7. 미리보기 이미지

PrvImage 스트림에는 미리보기 이미지가 BMP 또는 GIF 형식으로 저장된다.

### 3.2.8. 문서 옵션

DocOptions 스토리지에는 연결 문서, 배포용 문서, 공인인증서 DRM, 전자 서명 관련 정보가 각각의 스트림으로 저장된다.

_LinkDoc 스트림에는 연결된 문서의 경로가 저장된다.

DrmLicense 스트림에는 DRM Packaging의 Verision 정의가 저장된다.

DrmRootSect 스트림에는 암호화 알고리즘이 저장된다.

CertDrmHeader 스트림에는 DRM Packaging의 Verision 정의가 저장된다.

CertDrmInfo 스트림에는 공인인증서 DRM 정보가 저장된다.

DigitalSignature 스트림에는 전자 서명 정보가 저장된다.

PublicKeyInfo 스트림에는 공개 키 정보가 저장된다.

### 3.2.9. 스크립트

Scripts 스토리지에는 Script 코드를 저장한다.

JScriptVersion 스트림에는 Script Version이 저장된다.

| 자료형 | 길이(바이트) | 설명 |
|--------|--------------|------|
| DWORD | 4 | 스크립트 버전 HIGH |
| DWORD | 4 | 스크립트 버전 LOW |
| **전체 길이** | **8** |  |

**표 8 스크립트 버전**

DefaultJScript 스트림에는 Script 헤더, 소스, Pre 소스, Post 소스가 저장된다.

| 자료형 | 길이(바이트) | 설명 |
|--------|--------------|------|
| DWORD | 4 | 스크립트 헤더 길이 (len1) |
| WCHAR array[len1] | 2×len1 | 스크립트 헤더 |
| DWORD | 4 | 스크립트 소스 길이 (len2) |
| WCHAR array[len2] | 2×len2 | 스크립트 소스 |
| DWORD | 4 | 스크립트 Pre 소스 길이 (len3) |
| WCHAR array[len3] | 2×len3 | 스크립트 Pre 소스 |
| DWORD | 4 | 스크립트 Post 소스 길이 (len4) |
| WCHAR array[len4] | 2×len4 | 스크립트 Post 소스 |
| DWORD | 4 | 스크립트 end flag (-1) |
| **전체 길이** | **20 + (2×len1) + (2×len2) + (2×len3) + (2×len4)** |  |

**표 9 스크립트**

### 3.2.10. XML 템플릿

13