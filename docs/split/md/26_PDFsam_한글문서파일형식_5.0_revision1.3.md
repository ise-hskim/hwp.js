# 한글 문서 파일 형식 5.0

## 4.2.5. 테두리/배경

Tag ID : HWPTAG_BORDER_FILL

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT16 | 2 | 속성(표 24 참조) |
| UINT8 array[4] | 4 | 4방향 테두리선 종류(표 25 참조) |
| UINT8 array[4] | 4 | 4방향 테두리선 굵기(표 26 참조) |
| COLORREF array[4] | 16 | 4방향 테두리선 색상 |
| UINT8 | 1 | 대각선 종류(표 27 참조) |
| UINT8 | 1 | 대각선 굵기 |
| COLORREF | 4 | 대각선 색깔 |
| BYTE stream | n | 채우기 정보(표 28 참조) |
| 전체 길이 | 가변 | 32+n 바이트 |

### 표 23 테두리선 종류

| 값 | 설명 |
|----|------|
| 0 | 실선 |
| 1 | 긴 점선 |
| 2 | 점선 |
| 3 | -.-.-.-. |
| 4 | -..-..-..- |
| 5 | Dash보다 긴 선분의 반복 |
| 6 | Dot보다 큰 동그라미의 반복 |
| 7 | 2중선 |
| 8 | 가는선 + 굵은선 2중선 |
| 9 | 굵은선 + 가는선 2중선 |
| 10 | 가는선 + 굵은선 + 가는선 3중선 |
| 11 | 물결 |
| 12 | 물결 2중선 |
| 13 | 두꺼운 3D |

### 표 24 테두리/배경 속성

| 범위 | 설명 |
|------|------|
| bit 0 | 3D 효과의 유무 |
| bit 1 | 그림자 효과의 유무 |
| bit 2～4 | Slash 대각선 모양(시계 방향으로 각각의 대각선 유무를 나타냄)<br>000 : none<br>010 : slash<br>011 : LeftTop --> Bottom Edge<br>110 : LeftTop --> Right Edge<br>111 : LeftTop --> Bottom & Right Edge |
| bit 5～7 | BackSlash 대각선 모양(반시계 방향으로 각각의 대각선 유무를 나타냄)<br>000 : none<br>010 : / back slash<br>011 : RightTop --> Bottom Edge<br>110 : RightTop --> Left Edge<br>111 : RightTop --> Bottom & Left Edge |
| bit 8～9 | Slash 대각선 꺽은선 |
| bit 10 | BackSlash 대각선 꺽선 |
| bit 11 | Slash 대각선 모양 180도 회전 여부 |
| bit 12 | BackSlash 대각선 모양 180도 회전 여부 |
| bit 13 | 중심선 유무 |

---
*페이지: 21*

21