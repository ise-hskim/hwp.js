# OOXML 연동 시스템

HWP 5.0.2.0+에서 도입된 OOXML 차트 이중 저장 시스템에 대한 상세 설명입니다.

## 개요

OOXML(Office Open XML) 연동 시스템은 Microsoft Office와의 호환성을 위해 차트 데이터를 HWP 고유 형식과 OOXML 형식으로 동시에 저장하는 시스템입니다.

## 이중 저장 시스템 구조

### 차트 데이터 레코드 구조

```c
struct ChartDataRecord {
    // HWP 고유 차트 데이터
    struct HWPChartData {
        WORD chartType;             // 차트 타입
        WORD seriesCount;           // 데이터 시리즈 수
        WORD categoryCount;         // 카테고리 수
        
        // 데이터 시리즈
        struct DataSeries {
            WORD nameLength;
            WCHAR name[nameLength];
            WORD valueCount;
            double values[valueCount];
            COLORREF seriesColor;
        } series[seriesCount];
        
        // 차트 스타일 (HWP 형식)
        ChartStyle hwpStyle;
    } hwpData;
    
    // OOXML 차트 데이터 (5.0.2.0+)
    struct OOXMLChartData {
        DWORD signature;            // 'OOXML' (0x4C4D584F)
        DWORD version;              // OOXML 버전
        DWORD compressedSize;       // 압축된 크기
        DWORD originalSize;         // 원본 크기
        BYTE compressionMethod;     // 압축 방법 (zlib)
        
        // 압축된 OOXML 데이터
        BYTE compressedOOXML[compressedSize];
    } ooxmlData;
    
    // 메타데이터
    BYTE primaryFormat;         // 주 형식 (0=HWP, 1=OOXML)
    BYTE compatibility;         // 호환성 레벨
    DWORD lastSync;             // 마지막 동기화 시간
};
```

### OOXML 차트 추출

```c
int extractOOXMLChart(ChartDataRecord* record, BYTE** ooxmlData) {
    // 서명 검증
    if (record->ooxmlData.signature != 0x4C4D584F) {
        return -1;  // OOXML 데이터 없음
    }
    
    // 압축 해제
    *ooxmlData = malloc(record->ooxmlData.originalSize);
    
    int result = uncompress(*ooxmlData, &record->ooxmlData.originalSize,
                           record->ooxmlData.compressedOOXML, 
                           record->ooxmlData.compressedSize);
    
    if (result != Z_OK) {
        free(*ooxmlData);
        *ooxmlData = NULL;
        return -2;  // 압축 해제 실패
    }
    
    return record->ooxmlData.originalSize;
}
```

## OOXML 생성 및 변환

### HWP 차트 → OOXML 변환

```c
struct OOXMLGenerator {
    // XML 네임스페이스
    char namespaces[16][128];
    int namespaceCount;
    
    // 스타일 매핑 테이블
    struct StyleMapping {
        DWORD hwpStyleId;
        char ooxmlStyle[256];
    } styleMappings[64];
    
    int styleMappingCount;
};

char* convertHWPChartToOOXML(HWPChartData* hwpChart, OOXMLGenerator* generator) {
    StringBuilder xml;
    initStringBuilder(&xml, 8192);
    
    // XML 헤더
    appendString(&xml, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
    
    // 차트 루트 요소
    appendString(&xml, "<c:chartSpace xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\"");
    appendString(&xml, " xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">");
    
    // 차트 타입별 변환
    switch (hwpChart->chartType) {
        case HWP_CHART_COLUMN:
            generateColumnChart(&xml, hwpChart, generator);
            break;
        case HWP_CHART_LINE:
            generateLineChart(&xml, hwpChart, generator);
            break;
        case HWP_CHART_PIE:
            generatePieChart(&xml, hwpChart, generator);
            break;
        // 추가 차트 타입들...
    }
    
    appendString(&xml, "</c:chartSpace>");
    
    return xml.buffer;  // 호출자가 free() 해야 함
}

void generateColumnChart(StringBuilder* xml, HWPChartData* chart, OOXMLGenerator* generator) {
    appendString(xml, "<c:chart>");
    appendString(xml, "<c:plotArea>");
    appendString(xml, "<c:barChart>");
    
    // 차트 설정
    appendString(xml, "<c:barDir val=\"col\"/>");
    appendString(xml, "<c:grouping val=\"clustered\"/>");
    
    // 데이터 시리즈 변환
    for (int i = 0; i < chart->seriesCount; i++) {
        DataSeries* series = &chart->series[i];
        
        appendString(xml, "<c:ser>");
        appendFormatted(xml, "<c:idx val=\"%d\"/>", i);
        appendFormatted(xml, "<c:order val=\"%d\"/>", i);
        
        // 시리즈 이름
        appendString(xml, "<c:tx>");
        appendString(xml, "<c:strRef>");
        appendFormatted(xml, "<c:f>Sheet1!$B$1</c:f>");  // 임시 참조
        appendString(xml, "<c:strCache>");
        appendFormatted(xml, "<c:ptCount val=\"1\"/>");
        appendString(xml, "<c:pt idx=\"0\">");
        appendFormatted(xml, "<c:v>%ls</c:v>", series->name);
        appendString(xml, "</c:pt>");
        appendString(xml, "</c:strCache>");
        appendString(xml, "</c:strRef>");
        appendString(xml, "</c:tx>");
        
        // 데이터 값들
        appendString(xml, "<c:val>");
        appendString(xml, "<c:numRef>");
        appendFormatted(xml, "<c:f>Sheet1!$B$2:$B$%d</c:f>", series->valueCount + 1);
        appendString(xml, "<c:numCache>");
        appendFormatted(xml, "<c:formatCode>General</c:formatCode>");
        appendFormatted(xml, "<c:ptCount val=\"%d\"/>", series->valueCount);
        
        for (int j = 0; j < series->valueCount; j++) {
            appendFormatted(xml, "<c:pt idx=\"%d\">", j);
            appendFormatted(xml, "<c:v>%.6f</c:v>", series->values[j]);
            appendString(xml, "</c:pt>");
        }
        
        appendString(xml, "</c:numCache>");
        appendString(xml, "</c:numRef>");
        appendString(xml, "</c:val>");
        
        appendString(xml, "</c:ser>");
    }
    
    appendString(xml, "</c:barChart>");
    appendString(xml, "</c:plotArea>");
    appendString(xml, "</c:chart>");
}
```

### OOXML → HWP 차트 변환

```c
HWPChartData* parseOOXMLChart(const char* ooxmlData, int dataSize) {
    // XML 파서 초기화
    XMLParser parser;
    initXMLParser(&parser, ooxmlData, dataSize);
    
    HWPChartData* chart = malloc(sizeof(HWPChartData));
    memset(chart, 0, sizeof(HWPChartData));
    
    // 차트 루트 요소 찾기
    XMLNode* chartSpace = findElement(&parser, "c:chartSpace");
    if (!chartSpace) {
        free(chart);
        return NULL;
    }
    
    XMLNode* chartNode = findChildElement(chartSpace, "c:chart");
    XMLNode* plotArea = findChildElement(chartNode, "c:plotArea");
    
    // 차트 타입 감지
    if (findChildElement(plotArea, "c:barChart")) {
        chart->chartType = HWP_CHART_COLUMN;
        parseBarChart(plotArea, chart);
    } else if (findChildElement(plotArea, "c:lineChart")) {
        chart->chartType = HWP_CHART_LINE;
        parseLineChart(plotArea, chart);
    } else if (findChildElement(plotArea, "c:pieChart")) {
        chart->chartType = HWP_CHART_PIE;
        parsePieChart(plotArea, chart);
    }
    
    return chart;
}

void parseBarChart(XMLNode* plotArea, HWPChartData* chart) {
    XMLNode* barChart = findChildElement(plotArea, "c:barChart");
    XMLNodeList* seriesList = findChildElements(barChart, "c:ser");
    
    chart->seriesCount = seriesList->count;
    chart->series = malloc(sizeof(DataSeries) * chart->seriesCount);
    
    for (int i = 0; i < chart->seriesCount; i++) {
        XMLNode* seriesNode = seriesList->nodes[i];
        DataSeries* series = &chart->series[i];
        
        // 시리즈 이름 파싱
        XMLNode* txNode = findChildElement(seriesNode, "c:tx");
        if (txNode) {
            XMLNode* vNode = findDescendantElement(txNode, "c:v");
            if (vNode) {
                wcsncpy(series->name, getElementText(vNode), 63);
                series->name[63] = 0;
            }
        }
        
        // 데이터 값 파싱
        XMLNode* valNode = findChildElement(seriesNode, "c:val");
        XMLNode* numCache = findDescendantElement(valNode, "c:numCache");
        XMLNodeList* ptNodes = findChildElements(numCache, "c:pt");
        
        series->valueCount = ptNodes->count;
        series->values = malloc(sizeof(double) * series->valueCount);
        
        for (int j = 0; j < series->valueCount; j++) {
            XMLNode* ptNode = ptNodes->nodes[j];
            XMLNode* vNode = findChildElement(ptNode, "c:v");
            series->values[j] = parseDouble(getElementText(vNode));
        }
    }
}
```

## 차트 스타일 매핑

### HWP ↔ OOXML 스타일 변환

```c
struct StyleConverter {
    // 색상 매핑
    struct ColorMapping {
        COLORREF hwpColor;
        char ooxmlColor[16];        // 예: "FF0000"
    } colorMappings[256];
    
    // 폰트 매핑
    struct FontMapping {
        WCHAR hwpFont[64];
        char ooxmlFont[64];
    } fontMappings[64];
    
    // 선 스타일 매핑
    struct LineStyleMapping {
        BYTE hwpLineStyle;
        char ooxmlLineStyle[32];    // 예: "solid", "dash", "dot"
    } lineStyleMappings[16];
};

void convertChartStyle(ChartStyle* hwpStyle, StyleConverter* converter, StringBuilder* xml) {
    // 배경색 변환
    char bgColor[8];
    convertColorToOOXML(hwpStyle->backgroundColor, bgColor, converter);
    appendFormatted(xml, "<c:spPr><a:solidFill><a:srgbClr val=\"%s\"/></a:solidFill></c:spPr>", bgColor);
    
    // 제목 스타일 변환
    if (hwpStyle->hasTitle) {
        appendString(xml, "<c:title>");
        appendString(xml, "<c:tx>");
        appendString(xml, "<c:rich>");
        
        // 제목 폰트 변환
        char titleFont[64];
        convertFontToOOXML(hwpStyle->titleFont, titleFont, converter);
        
        appendFormatted(xml, "<a:p><a:pPr><a:defRPr><a:latin typeface=\"%s\"/></a:defRPr></a:pPr>", titleFont);
        appendFormatted(xml, "<a:r><a:t>%ls</a:t></a:r>", hwpStyle->titleText);
        appendString(xml, "</a:p>");
        
        appendString(xml, "</c:rich>");
        appendString(xml, "</c:tx>");
        appendString(xml, "</c:title>");
    }
    
    // 축 스타일 변환
    convertAxisStyles(hwpStyle, converter, xml);
    
    // 범례 스타일 변환
    convertLegendStyle(hwpStyle, converter, xml);
}

void convertColorToOOXML(COLORREF hwpColor, char* ooxmlColor, StyleConverter* converter) {
    // HWP COLORREF (0x00BBGGRR) → OOXML RGB (RRGGBB)
    BYTE r = hwpColor & 0xFF;
    BYTE g = (hwpColor >> 8) & 0xFF;
    BYTE b = (hwpColor >> 16) & 0xFF;
    
    sprintf(ooxmlColor, "%02X%02X%02X", r, g, b);
}
```

## 차트 타입별 변환

### 1. 세로 막대형 차트

```c
void generateOOXMLColumnChart(HWPChartData* hwpChart, StringBuilder* xml) {
    appendString(xml, "<c:barChart>");
    appendString(xml, "<c:barDir val=\"col\"/>");
    
    // 그룹화 방식
    switch (hwpChart->grouping) {
        case HWP_GROUPING_CLUSTERED:
            appendString(xml, "<c:grouping val=\"clustered\"/>");
            break;
        case HWP_GROUPING_STACKED:
            appendString(xml, "<c:grouping val=\"stacked\"/>");
            break;
        case HWP_GROUPING_PERCENT_STACKED:
            appendString(xml, "<c:grouping val=\"percentStacked\"/>");
            break;
    }
    
    // 데이터 시리즈 변환
    for (int i = 0; i < hwpChart->seriesCount; i++) {
        generateOOXMLSeries(&hwpChart->series[i], i, xml);
    }
    
    // 축 ID 참조
    appendString(xml, "<c:axId val=\"1\"/>");  // 카테고리 축
    appendString(xml, "<c:axId val=\"2\"/>");  // 값 축
    
    appendString(xml, "</c:barChart>");
    
    // 축 정의
    generateOOXMLAxes(hwpChart, xml);
}
```

### 2. 원형 차트

```c
void generateOOXMLPieChart(HWPChartData* hwpChart, StringBuilder* xml) {
    appendString(xml, "<c:pieChart>");
    
    // 도넛 차트 여부
    if (hwpChart->isDonut) {
        appendFormatted(xml, "<c:holeSize val=\"%d\"/>", hwpChart->donutHoleSize);
    }
    
    // 시작 각도
    appendFormatted(xml, "<c:firstSliceAng val=\"%d\"/>", hwpChart->startAngle);
    
    // 데이터 시리즈 (원형 차트는 보통 하나)
    if (hwpChart->seriesCount > 0) {
        generateOOXMLPieSeries(&hwpChart->series[0], xml);
    }
    
    appendString(xml, "</c:pieChart>");
}

void generateOOXMLPieSeries(DataSeries* series, StringBuilder* xml) {
    appendString(xml, "<c:ser>");
    appendString(xml, "<c:idx val=\"0\"/>");
    appendString(xml, "<c:order val=\"0\"/>");
    
    // 카테고리 레이블
    appendString(xml, "<c:cat>");
    appendString(xml, "<c:strLit>");
    appendFormatted(xml, "<c:ptCount val=\"%d\"/>", series->valueCount);
    
    for (int i = 0; i < series->valueCount; i++) {
        appendFormatted(xml, "<c:pt idx=\"%d\">", i);
        appendFormatted(xml, "<c:v>카테고리 %d</c:v>", i + 1);
        appendString(xml, "</c:pt>");
    }
    
    appendString(xml, "</c:strLit>");
    appendString(xml, "</c:cat>");
    
    // 데이터 값
    appendString(xml, "<c:val>");
    appendString(xml, "<c:numLit>");
    appendFormatted(xml, "<c:ptCount val=\"%d\"/>", series->valueCount);
    
    for (int i = 0; i < series->valueCount; i++) {
        appendFormatted(xml, "<c:pt idx=\"%d\">", i);
        appendFormatted(xml, "<c:v>%.6f</c:v>", series->values[i]);
        appendString(xml, "</c:pt>");
    }
    
    appendString(xml, "</c:numLit>");
    appendString(xml, "</c:val>");
    
    appendString(xml, "</c:ser>");
}
```

## 동기화 시스템

### 차트 데이터 동기화

```c
struct ChartSyncManager {
    DWORD lastHWPModified;      // HWP 데이터 마지막 수정
    DWORD lastOOXMLModified;    // OOXML 데이터 마지막 수정
    BYTE syncDirection;         // 동기화 방향
    BOOL autoSync;              // 자동 동기화
    DWORD syncInterval;         // 동기화 간격 (밀리초)
};

enum SyncDirection {
    SYNC_HWP_TO_OOXML = 0,      // HWP → OOXML
    SYNC_OOXML_TO_HWP = 1,      // OOXML → HWP
    SYNC_BIDIRECTIONAL = 2,     // 양방향 (마지막 수정 기준)
    SYNC_MANUAL_ONLY = 3        // 수동 동기화만
};

void synchronizeChartData(ChartDataRecord* record, ChartSyncManager* syncManager) {
    DWORD currentTime = getCurrentTime();
    
    if (!syncManager->autoSync) {
        return;  // 자동 동기화 비활성화
    }
    
    // 동기화 필요성 확인
    if (currentTime - syncManager->lastOOXMLModified < syncManager->syncInterval &&
        currentTime - syncManager->lastHWPModified < syncManager->syncInterval) {
        return;  // 아직 동기화 간격이 지나지 않음
    }
    
    // 동기화 방향 결정
    BYTE direction = syncManager->syncDirection;
    if (direction == SYNC_BIDIRECTIONAL) {
        if (syncManager->lastHWPModified > syncManager->lastOOXMLModified) {
            direction = SYNC_HWP_TO_OOXML;
        } else {
            direction = SYNC_OOXML_TO_HWP;
        }
    }
    
    // 동기화 실행
    switch (direction) {
        case SYNC_HWP_TO_OOXML:
            updateOOXMLFromHWP(record);
            syncManager->lastOOXMLModified = currentTime;
            break;
            
        case SYNC_OOXML_TO_HWP:
            updateHWPFromOOXML(record);
            syncManager->lastHWPModified = currentTime;
            break;
    }
}
```

## 호환성 매트릭스

### Microsoft Office 버전별 지원

```c
struct OfficeCompatibility {
    struct OfficeVersion {
        WORD majorVersion;
        WORD minorVersion;
        char name[32];
        DWORD supportedFeatures;    // 비트마스크
    } versions[16];
    
    int versionCount;
};

// 지원 기능 플래그
enum OfficeFeature {
    FEATURE_BASIC_CHARTS = 1 << 0,
    FEATURE_3D_CHARTS = 1 << 1,
    FEATURE_COMBO_CHARTS = 1 << 2,
    FEATURE_CUSTOM_STYLES = 1 << 3,
    FEATURE_ANIMATIONS = 1 << 4,
    FEATURE_INTERACTIVITY = 1 << 5,
    FEATURE_DATA_BINDING = 1 << 6,
    FEATURE_PIVOT_CHARTS = 1 << 7
};

BOOL isFeatureSupported(OfficeCompatibility* compat, WORD majorVer, WORD minorVer, 
                       OfficeFeature feature) {
    for (int i = 0; i < compat->versionCount; i++) {
        OfficeVersion* version = &compat->versions[i];
        if (version->majorVersion == majorVer && version->minorVersion >= minorVer) {
            return (version->supportedFeatures & feature) != 0;
        }
    }
    return FALSE;
}
```

### 기능 저하 처리 (Graceful Degradation)

```c
void degradeChartForCompatibility(HWPChartData* chart, WORD targetOfficeVersion) {
    OfficeCompatibility compat;
    loadOfficeCompatibility(&compat);
    
    // 지원하지 않는 기능 제거
    if (!isFeatureSupported(&compat, targetOfficeVersion, 0, FEATURE_3D_CHARTS)) {
        // 3D 효과 제거
        for (int i = 0; i < chart->seriesCount; i++) {
            chart->series[i].is3D = FALSE;
            chart->series[i].depth = 0;
        }
    }
    
    if (!isFeatureSupported(&compat, targetOfficeVersion, 0, FEATURE_CUSTOM_STYLES)) {
        // 사용자 정의 스타일을 기본 스타일로 변경
        for (int i = 0; i < chart->seriesCount; i++) {
            if (chart->series[i].styleType == STYLE_CUSTOM) {
                chart->series[i].styleType = STYLE_DEFAULT;
                assignDefaultSeriesColor(&chart->series[i], i);
            }
        }
    }
    
    // 차트 복잡도 감소
    if (chart->seriesCount > 10) {
        // 시리즈 수 제한
        chart->seriesCount = 10;
        chart->series = realloc(chart->series, sizeof(DataSeries) * 10);
    }
}
```

## 패키징 및 압축

### OOXML 패키지 생성

```c
struct OOXMLPackage {
    // 패키지 구성 요소
    char* contentTypes;         // [Content_Types].xml
    char* relationships;        // _rels/.rels
    char* chartXML;            // chart/chart1.xml
    char* chartRelationships;  // chart/_rels/chart1.xml.rels
    
    // 압축 설정
    int compressionLevel;       // 0-9 (zlib)
    BOOL useZip64;             // ZIP64 형식 사용
};

int createOOXMLPackage(HWPChartData* hwpChart, OOXMLPackage* package) {
    // Content Types 생성
    package->contentTypes = createContentTypes();
    
    // Relationships 생성
    package->relationships = createMainRelationships();
    
    // 차트 XML 생성
    OOXMLGenerator generator;
    initOOXMLGenerator(&generator);
    package->chartXML = convertHWPChartToOOXML(hwpChart, &generator);
    
    // 차트 관계 생성
    package->chartRelationships = createChartRelationships();
    
    // ZIP 아카이브로 패키징
    return packageAsZIP(package);
}

char* createContentTypes() {
    StringBuilder xml;
    initStringBuilder(&xml, 1024);
    
    appendString(&xml, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
    appendString(&xml, "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">");
    
    // 기본 확장자
    appendString(&xml, "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>");
    appendString(&xml, "<Default Extension=\"xml\" ContentType=\"application/xml\"/>");
    
    // 차트 타입
    appendString(&xml, "<Override PartName=\"/chart/chart1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.drawingml.chart+xml\"/>");
    
    appendString(&xml, "</Types>");
    
    return xml.buffer;
}
```

## 오류 처리 및 복구

### OOXML 검증

```c
struct OOXMLValidator {
    // 스키마 정보
    char schemaVersion[16];
    char* requiredNamespaces[8];
    int namespaceCount;
    
    // 검증 규칙
    struct ValidationRule {
        char elementPath[256];
        char requiredAttributes[16][64];
        int attributeCount;
        BOOL isMandatory;
    } rules[128];
    
    int ruleCount;
};

ValidationResult validateOOXMLChart(const char* ooxmlData, OOXMLValidator* validator) {
    ValidationResult result = {TRUE, 0, ""};
    
    XMLParser parser;
    initXMLParser(&parser, ooxmlData, strlen(ooxmlData));
    
    // 네임스페이스 검증
    for (int i = 0; i < validator->namespaceCount; i++) {
        if (!hasNamespace(&parser, validator->requiredNamespaces[i])) {
            result.isValid = FALSE;
            sprintf(result.errorMessage, "Missing namespace: %s", 
                   validator->requiredNamespaces[i]);
            return result;
        }
    }
    
    // 구조 검증
    for (int i = 0; i < validator->ruleCount; i++) {
        ValidationRule* rule = &validator->rules[i];
        XMLNode* element = findElementByPath(&parser, rule->elementPath);
        
        if (!element && rule->isMandatory) {
            result.isValid = FALSE;
            sprintf(result.errorMessage, "Missing mandatory element: %s", 
                   rule->elementPath);
            return result;
        }
        
        if (element) {
            // 속성 검증
            for (int j = 0; j < rule->attributeCount; j++) {
                if (!hasAttribute(element, rule->requiredAttributes[j])) {
                    result.isValid = FALSE;
                    sprintf(result.errorMessage, "Missing attribute %s in %s", 
                           rule->requiredAttributes[j], rule->elementPath);
                    return result;
                }
            }
        }
    }
    
    return result;
}
```

### 복구 메커니즘

```c
ChartDataRecord* repairCorruptedChart(ChartDataRecord* corruptedRecord) {
    ChartDataRecord* repairedRecord = malloc(sizeof(ChartDataRecord));
    memcpy(repairedRecord, corruptedRecord, sizeof(ChartDataRecord));
    
    // HWP 데이터 복구 시도
    if (!validateHWPChart(&repairedRecord->hwpData)) {
        if (repairedRecord->ooxmlData.signature == 0x4C4D584F) {
            // OOXML에서 HWP 데이터 재생성
            BYTE* ooxmlData;
            int ooxmlSize = extractOOXMLChart(repairedRecord, &ooxmlData);
            
            if (ooxmlSize > 0) {
                HWPChartData* recoveredHWP = parseOOXMLChart(ooxmlData, ooxmlSize);
                if (recoveredHWP) {
                    memcpy(&repairedRecord->hwpData, recoveredHWP, sizeof(HWPChartData));
                    free(recoveredHWP);
                }
                free(ooxmlData);
            }
        }
    }
    
    // OOXML 데이터 복구 시도
    if (repairedRecord->ooxmlData.signature != 0x4C4D584F) {
        // HWP에서 OOXML 데이터 재생성
        OOXMLGenerator generator;
        initOOXMLGenerator(&generator);
        char* regeneratedOOXML = convertHWPChartToOOXML(&repairedRecord->hwpData, &generator);
        
        if (regeneratedOOXML) {
            // 압축 및 저장
            compressAndStoreOOXML(repairedRecord, regeneratedOOXML);
            free(regeneratedOOXML);
        }
    }
    
    return repairedRecord;
}
```

## 최적화 전략

### 1. 지연 변환

```c
struct LazyOOXMLConverter {
    DWORD chartId;
    BOOL ooxmlGenerated;
    char* cachedOOXML;
    DWORD cacheSize;
    DWORD lastHWPModification;
};

char* getLazyOOXML(DWORD chartId, LazyOOXMLConverter* converters, int count) {
    LazyOOXMLConverter* converter = findConverter(chartId, converters, count);
    
    if (!converter) {
        return NULL;
    }
    
    // 캐시 유효성 확인
    DWORD currentHWPModification = getChartLastModified(chartId);
    if (converter->ooxmlGenerated && 
        converter->lastHWPModification >= currentHWPModification) {
        return converter->cachedOOXML;  // 캐시된 결과 반환
    }
    
    // OOXML 재생성
    HWPChartData* hwpChart = getHWPChart(chartId);
    OOXMLGenerator generator;
    initOOXMLGenerator(&generator);
    
    // 기존 캐시 해제
    if (converter->cachedOOXML) {
        free(converter->cachedOOXML);
    }
    
    // 새 OOXML 생성
    converter->cachedOOXML = convertHWPChartToOOXML(hwpChart, &generator);
    converter->cacheSize = strlen(converter->cachedOOXML);
    converter->lastHWPModification = currentHWPModification;
    converter->ooxmlGenerated = TRUE;
    
    return converter->cachedOOXML;
}
```

### 2. 증분 업데이트

```c
void incrementalOOXMLUpdate(ChartDataRecord* record, ChartModification* modification) {
    switch (modification->type) {
        case CHART_MOD_ADD_SERIES:
            // 새 시리즈만 OOXML에 추가
            appendSeriesToOOXML(record, modification->seriesData);
            break;
            
        case CHART_MOD_UPDATE_VALUE:
            // 특정 값만 OOXML에서 업데이트
            updateValueInOOXML(record, modification->seriesIndex, 
                              modification->valueIndex, modification->newValue);
            break;
            
        case CHART_MOD_CHANGE_STYLE:
            // 스타일 섹션만 재생성
            updateStyleInOOXML(record, modification->styleData);
            break;
            
        default:
            // 전체 재생성
            regenerateCompleteOOXML(record);
            break;
    }
}
```

## 주의사항

1. **메모리 사용량**: OOXML 데이터는 압축하여 저장
2. **동기화 비용**: 양방향 동기화 시 성능 고려
3. **스키마 호환성**: Office 버전별 OOXML 스키마 차이 처리
4. **인코딩**: OOXML은 UTF-8, HWP는 UTF-16 주의
5. **네임스페이스**: XML 네임스페이스 충돌 방지
6. **검증**: 생성된 OOXML의 유효성 검사 필수
7. **백업**: 원본 HWP 데이터는 항상 보존