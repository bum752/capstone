# capstone
[![Build Status](https://travis-ci.org/bum752/capstone.svg?branch=master)](https://travis-ci.org/bum752/capstone)
[![badge](https://img.shields.io/badge/author-bum752-lightgrey.svg)](https://bum752.github.io)

부경대학교 컴퓨터공학과 캡스톤 스마트 미러 프로젝트의 mqtt broker입니다.

#### key.json
```
{
  "openweather": "OPENWEATHER_API_KEY"
}
```

## MQTT Publish

| 구분 |  | 토픽 | 메시지 |
| --- | --- | --- | --- |
| 알람 | 추가 | set | HOUR(0 to 24) MINUTE(0 to 60) TITLE |
|  | 삭제 | unset | alarm ID |
|  | 조회 | get | alarm |
| 일정 | 추가 | set | TIMESTAMP TITLE |
|  | 삭제 | unset | schedule ID |
|  | 조회 | get | schedule |
| (수정 예정) |
| 날씨 | 조회 | get | weather REGION |
| 헤드라인 뉴스 | 조회 | get | news |

## MQTT Subscribe
| 토픽 | 메시지 |
| --- | --- |
| alarm | ALARM LIST (JSON Array) |
| schedule | SCHEDULE LIST (JSON Array) |
| weather | WEATHER (JSON) |
| news | NEWS (JSON Array) |
