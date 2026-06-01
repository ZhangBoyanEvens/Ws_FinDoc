/**
 * Vetra District：国家 / 一级行政区（省、州、邦等）知识库。
 * `code` 在同一国家内唯一，用于 option value；`name` 为展示用英文常用名。
 */

function regionsFromCsv(csv) {
  return csv
    .trim()
    .split('\n')
    .map((line) => {
      const i = line.indexOf(',')
      if (i <= 0) return null
      return { code: line.slice(0, i).trim(), name: line.slice(i + 1).trim() }
    })
    .filter(Boolean)
}

const US_CSV = `AL,Alabama
AK,Alaska
AZ,Arizona
AR,Arkansas
CA,California
CO,Colorado
CT,Connecticut
DE,Delaware
DC,District of Columbia
FL,Florida
GA,Georgia
HI,Hawaii
ID,Idaho
IL,Illinois
IN,Indiana
IA,Iowa
KS,Kansas
KY,Kentucky
LA,Louisiana
ME,Maine
MD,Maryland
MA,Massachusetts
MI,Michigan
MN,Minnesota
MS,Mississippi
MO,Missouri
MT,Montana
NE,Nebraska
NV,Nevada
NH,New Hampshire
NJ,New Jersey
NM,New Mexico
NY,New York
NC,North Carolina
ND,North Dakota
OH,Ohio
OK,Oklahoma
OR,Oregon
PA,Pennsylvania
RI,Rhode Island
SC,South Carolina
SD,South Dakota
TN,Tennessee
TX,Texas
UT,Utah
VT,Vermont
VA,Virginia
WA,Washington
WV,West Virginia
WI,Wisconsin
WY,Wyoming`

const CN_CSV = `BJ,Beijing
TJ,Tianjin
HE,Hebei
SX,Shanxi
NM,Inner Mongolia
LN,Liaoning
JL,Jilin
HL,Heilongjiang
SH,Shanghai
JS,Jiangsu
ZJ,Zhejiang
AH,Anhui
FJ,Fujian
JX,Jiangxi
SD,Shandong
HA,Henan
HB,Hubei
HN,Hunan
GD,Guangdong
GX,Guangxi
HI,Hainan
CQ,Chongqing
SC,Sichuan
GZ,Guizhou
YN,Yunnan
XZ,Tibet
SN,Shaanxi
GS,Gansu
QH,Qinghai
NX,Ningxia
XJ,Xinjiang
HK,Hong Kong
MO,Macau
TW,Taiwan`

const CA_CSV = `AB,Alberta
BC,British Columbia
MB,Manitoba
NB,New Brunswick
NL,Newfoundland and Labrador
NS,Nova Scotia
NT,Northwest Territories
NU,Nunavut
ON,Ontario
PE,Prince Edward Island
QC,Quebec
SK,Saskatchewan
YT,Yukon`

const AU_CSV = `NSW,New South Wales
VIC,Victoria
QLD,Queensland
WA,Western Australia
SA,South Australia
TAS,Tasmania
ACT,Australian Capital Territory
NT,Northern Territory`

const DE_CSV = `BW,Baden-Württemberg
BY,Bavaria
BE,Berlin
BB,Brandenburg
HB,Bremen
HH,Hamburg
HE,Hesse
MV,Mecklenburg-Vorpommern
NI,Lower Saxony
NW,North Rhine-Westphalia
RP,Rhineland-Palatinate
SL,Saarland
SN,Saxony
ST,Saxony-Anhalt
SH,Schleswig-Holstein
TH,Thuringia`

const JP_CSV = `01,Hokkaido
02,Aomori
03,Iwate
04,Miyagi
05,Akita
06,Yamagata
07,Fukushima
08,Ibaraki
09,Tochigi
10,Gunma
11,Saitama
12,Chiba
13,Tokyo
14,Kanagawa
15,Niigata
16,Toyama
17,Ishikawa
18,Fukui
19,Yamanashi
20,Nagano
21,Gifu
22,Shizuoka
23,Aichi
24,Mie
25,Shiga
26,Kyoto
27,Osaka
28,Hyogo
29,Nara
30,Wakayama
31,Tottori
32,Shimane
33,Okayama
34,Hiroshima
35,Yamaguchi
36,Tokushima
37,Kagawa
38,Ehime
39,Kochi
40,Fukuoka
41,Saga
42,Nagasaki
43,Kumamoto
44,Oita
45,Miyazaki
46,Kagoshima
47,Okinawa`

const FR_CSV = `ARA,Auvergne-Rhône-Alpes
BFC,Bourgogne-Franche-Comté
BRE,Brittany
CVL,Centre-Val de Loire
COR,Corsica
GES,Grand Est
HDF,Hauts-de-France
IDF,Île-de-France
NOR,Normandy
NAQ,Nouvelle-Aquitaine
OCC,Occitanie
PDL,Pays de la Loire
PAC,Provence-Alpes-Côte d'Azur`

const GB_CSV = `ENG,England
SCT,Scotland
WLS,Wales
NIR,Northern Ireland`

const KR_CSV = `11,Seoul
26,Busan
27,Daegu
28,Incheon
29,Gwangju
30,Daejeon
31,Ulsan
41,Gyeonggi
42,Gangwon
43,North Chungcheong
44,South Chungcheong
45,North Jeolla
46,South Jeolla
47,North Gyeongsang
48,South Gyeongsang
49,Jeju
50,Sejong`

const IN_CSV = `AP,Andhra Pradesh
AR,Arunachal Pradesh
AS,Assam
BR,Bihar
CT,Chhattisgarh
GA,Goa
GJ,Gujarat
HR,Haryana
HP,Himachal Pradesh
JH,Jharkhand
KA,Karnataka
KL,Kerala
MP,Madhya Pradesh
MH,Maharashtra
MN,Manipur
ML,Meghalaya
MZ,Mizoram
NL,Nagaland
OR,Odisha
PB,Punjab
RJ,Rajasthan
SK,Sikkim
TN,Tamil Nadu
TG,Telangana
TR,Tripura
UP,Uttar Pradesh
UT,Uttarakhand
WB,West Bengal
AN,Andaman and Nicobar Islands
CH,Chandigarh
DN,Dadra and Nagar Haveli and Daman and Diu
DL,Delhi
JK,Jammu and Kashmir
LA,Ladakh
LD,Lakshadweep
PY,Puducherry`

const SG_REGIONS = [{ code: 'SG', name: 'Singapore' }]

/** @type {Record<string, { name: string, regions: { code: string, name: string }[] }>} */
export const VETRA_COUNTRY_REGION_KB = {
  CN: { name: 'China', regions: regionsFromCsv(CN_CSV) },
  US: { name: 'United States', regions: regionsFromCsv(US_CSV) },
  CA: { name: 'Canada', regions: regionsFromCsv(CA_CSV) },
  AU: { name: 'Australia', regions: regionsFromCsv(AU_CSV) },
  DE: { name: 'Germany', regions: regionsFromCsv(DE_CSV) },
  JP: { name: 'Japan', regions: regionsFromCsv(JP_CSV) },
  FR: { name: 'France', regions: regionsFromCsv(FR_CSV) },
  GB: { name: 'United Kingdom', regions: regionsFromCsv(GB_CSV) },
  KR: { name: 'South Korea', regions: regionsFromCsv(KR_CSV) },
  IN: { name: 'India', regions: regionsFromCsv(IN_CSV) },
  SG: { name: 'Singapore', regions: SG_REGIONS },
}

/** 下拉：按英文国名排序 */
export const VETRA_COUNTRY_OPTIONS = Object.entries(VETRA_COUNTRY_REGION_KB)
  .map(([code, { name }]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'))

/** 根据国家代码返回一级行政区列表（无则空数组） */
export function vetraRegionsForCountry(countryCode) {
  if (!countryCode || !VETRA_COUNTRY_REGION_KB[countryCode]) return []
  return VETRA_COUNTRY_REGION_KB[countryCode].regions
}
