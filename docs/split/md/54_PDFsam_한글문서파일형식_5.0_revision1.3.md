# 한글 문서 파일 형식 5.0

## 표 115 색상 효과 종류

| 값 | 설명 |
|----|------|
| 0 | alpha |
| 1 | alpha_mod |
| 2 | alpha_off |
| 3 | red |
| 4 | red_mod |
| 5 | red_off |
| 6 | green |
| 7 | green_mod |
| 8 | green_off |
| 9 | blue |
| 10 | blue_mod |
| 11 | blue_off |
| 12 | hue |
| 13 | hue_mod |
| 14 | hue_off |
| 15 | sat |
| 16 | sat_mod |
| 17 | sat_off |
| 18 | lum |
| 19 | lum_mod |
| 20 | lum_off |
| 21 | shade |
| 22 | tint |
| 23 | gray |
| 24 | comp |
| 25 | gamma |
| 26 | inv_gamma |
| 27 | inv |

## 표 116 그림 추가 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| HWPUNIT | 4×2 | 그림 최초 생성 시 기준 이미지 크기 |
| INT8 | 1 | 이미지 투명도 |
| 전체 길이 | 9 |  |

## 4.3.9.5. OLE 개체(HWPTAG_SHAPE_COMPONENT_OLE)

### 표 117 OLE 개체

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| BYTE stream | n | 개체 공통 속성(표 68 참조) |
| BYTE stream | 24 | OLE 개체 속성(표 118 참조) |
| 전체 길이 | 가변 | 24 + n 바이트 |

### 표 118 OLE 개체 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| UINT16 | 2 | 속성(표 119 참조) |
| INT32 | 4 | 오브젝트 자체의 extent x크기 |
| INT32 | 4 | 오브젝트 자체의 extent y크기 |
| UINT16 | 2 | 오브젝트가 사용하는 스토리지의 BinData ID |

---
페이지: 49

49