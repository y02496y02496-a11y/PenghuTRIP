import { Trip } from "../types";

export const defaultTrip: Trip = {
  id: "penghu-4d3n-standard",
  title: "澎湖暑期四天三夜經典行程",
  description: "2位大人悠閒不排滿，含潮間帶探索、國定古蹟朝聖、美食打卡、最美日出與落日，並在絕美七美島過夜一晚！",
  location: "澎湖",
  startDate: "2026-06-18",
  endDate: "2026-06-21",
  createdAt: 1781577600000, // Roughly June 2026
  updatedAt: 1781577600000,
  schedule: {
    "2026-06-18": [
      {
        id: "d1-t1",
        time: "07:30",
        title: "布袋港乘船出發",
        location: "嘉義布袋港",
        description: "搭乘百麗航運交通船前往澎湖馬公港（請提前40分鐘前抵達報到）。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d1-t2",
        time: "09:30",
        title: "抵達馬公 & 領取租借機車",
        location: "馬公港",
        description: "領取預定的機車，記得向車行確認隔天（6/19）寄放機車事宜。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t3",
        time: "10:00",
        title: "隘門沙灘 / 林投沙灘拍照",
        location: "隘門沙灘",
        description: "隘門沙灘沙質非常細白，非常適合拍照，吹吹海風適應陽光。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t4",
        time: "11:30",
        title: "午餐（豐盛澎湖海鮮）",
        location: "馬公市區 / 第三漁港周邊",
        description: "選一家在地海產店大快朵頤，預算約1000元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t5",
        time: "13:30",
        title: "隘門潮間帶探索",
        location: "隘門潮間帶",
        description: "依據潮汐低潮時間進行潮間帶觀察（建議穿防滑膠鞋避免割傷）。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d1-t6",
        time: "16:00",
        title: "風旅 Life Inn 辦理入住",
        location: "風旅 Life Inn",
        description: "登記入住辦理，寄放行李適度沖洗，小歇一下避開最烈的下午太陽。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t7",
        time: "17:30",
        title: "觀音亭親水園區賞夕陽",
        location: "觀音亭親水遊憩區",
        description: "坐在海堤旁看澎湖落日（今日預估日落時間為 18:49）。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t8",
        time: "19:00",
        title: "晚餐（市區海邊餐廳）",
        location: "觀音亭 / 中央老街附近",
        description: "一邊遠眺海景一邊吃澎湖風味炒麵及海產，預算約1000元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d1-t9",
        time: "21:00",
        title: "觀音亭澎湖花火節煙火秀",
        location: "觀音亭園區",
        description: "約10分鐘煙火表演及精彩的無人機科技燈光秀，澎湖夏日最核心亮點！",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      }
    ],
    "2026-06-19": [
      {
        id: "d2-t1",
        time: "07:30",
        title: "退房 & 港邊早餐",
        location: "馬公前往南海之星码頭途中",
        description: "整理輕裝行李退房，主行李寄放。在路邊早餐店享用美味早點（預算300元）。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d2-t2",
        time: "08:30",
        title: "南海遊客中心報到買票",
        location: "南海遊客中心",
        description: "將機車交給配合車行做一日保管。提前30分鐘在遊客中心櫃檯報到取票。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d2-t3",
        time: "09:30",
        title: "搭乘南海之星前往七美",
        location: "南海之星定期船班",
        description: "搭船出發，中途會經過望安島。建議登船前30分鐘服用暈船藥。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t4",
        time: "11:35",
        title: "抵達七美港 & 南滬57民宿",
        location: "南滬57民宿",
        description: "抵達七美島。先到南滬57辦理入住，放行李，並跟民宿租借環島用機車。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t5",
        time: "12:00",
        title: "午餐（七美名物越南大骨湯麵）",
        location: "七美港附近小吃區",
        description: "排隊品嚐著名的澎湖風越南大骨湯麵，大碗過癮，預算1000元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t6",
        time: "13:30",
        title: "七美環島觀光（玄武岩與石滬）",
        location: "雙心石滬、小台灣",
        description: "騎車環七美島：拍雙心石滬（澎湖代名詞！）、地質奇景小台灣、七美人塚、龍埕硯。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t7",
        time: "18:00",
        title: "七美西海岸看日落",
        location: "七美落日角 / 水庫旁海岸",
        description: "在微風海浪下看無污染、視野開闊的外島夕陽，日落約 18:49。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t8",
        time: "19:00",
        title: "晚餐（七美碼頭海鮮小吃）",
        location: "七美南滬港周邊",
        description: "點幾道外島的鮮炒小管、魚湯，預算約1000元（島上店家多收現金）。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d2-t9",
        time: "21:00",
        title: "七美夜間璀璨星空漫步",
        location: "七美無光害道路 or 燈塔旁",
        description: "離島光害極低，天氣晴朗時可肉眼看到大量星星甚至銀河！早點睡準備早起看日出。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      }
    ],
    "2026-06-20": [
      {
        id: "d3-t1",
        time: "04:50",
        title: "七美東側觀賞絕美日出",
        location: "七美東側面海處",
        description: "騎車到東海岸等待初光（本日日落/日出預計 05:10，視野極好）。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 10
      },
      {
        id: "d3-t2",
        time: "06:10",
        title: "搭乘得意1號返航馬公",
        location: "七美南滬港",
        description: "搭乘「得意1號」夜泊船返馬公，中途經望安，預計 07:40 抵達馬公。一定要準時。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d3-t3",
        time: "08:00",
        title: "早餐 & 領回馬公機車",
        location: "馬公南海碼頭早餐街",
        description: "下船後肚子餓，買個在地燒餅或粥（預算300元），並跟車行領回原本的託管機車。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d3-t4",
        time: "09:30",
        title: "騎車北環西嶼古蹟行",
        location: "西嶼 / 跨海大橋",
        description: "騎車過跨海大橋前往西嶼，探訪大菓葉柱狀玄武岩（大自然鬼斧神工）與西嶼西臺國定古蹟。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d3-t5",
        time: "12:30",
        title: "午餐（西嶼人氣海味餐館）",
        location: "西嶼大池 / 外垵附近",
        description: "找合界或外垵的海鮮大排檔點花枝丸、紅甘魚湯，預算1000元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d3-t6",
        time: "13:30",
        title: "內垵沙灘踏浪/潮間帶",
        location: "內垵沙灘",
        description: "潮間帶戲水，看岩礁區的螃蟹、海星。此沙灘人煙較少，很清幽。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d3-t7",
        time: "16:00",
        title: "Fun閃晴旅民宿辦理入住",
        location: "Fun閃晴旅民宿",
        description: "騎回馬公，在隘門附近的Fun閃晴旅民宿辦理入住，洗去沙子和海水，放鬆身心。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d3-t8",
        time: "17:30",
        title: "民宿周邊私房海堤看夕陽",
        location: "隘門/林投海線",
        description: "吹著海風看漫天晚霞。在附近找一家熱炒海鮮餐廳，預算約1000元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      }
    ],
    "2026-06-21": [
      {
        id: "d4-t1",
        time: "05:15",
        title: "隘門沙灘日出曙光",
        location: "隘門沙灘",
        description: "在隘門沙灘迎著金黃日出晨跑或散步，享受澄澈蔚藍的清新澎湖早晨。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d4-t2",
        time: "06:30",
        title: "早餐時間",
        location: "林投 / 隘門附近小店",
        description: "吃個溫熱的水煎包與澎湖海鮮粥，暖胃養神，預算300元。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d4-t3",
        time: "08:00",
        title: "中央老街瘋狂伴手禮採購",
        location: "中央老街",
        description: "採購澎湖最讚伴手禮：黑糖糕、神級花生酥、風茹茶茶包、文石飾品等等送人自用。",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      },
      {
        id: "d4-t4",
        time: "10:30",
        title: "機車加油歸還 & 前往港口",
        location: "馬公港候船室",
        description: "將機車開去加滿油、還車給車行。拎著大包小包伴手禮和行李步行至候船室準備安檢。",
        completed: false,
        reminderEnabled: true,
        reminderMinutesBefore: 15
      },
      {
        id: "d4-t5",
        time: "12:30",
        title: "乘船啟程返回嘉義布袋",
        location: "百麗航運客輪",
        description: "正式搭船返航，在船上睡個飽覺，大約下午14:00左右抵達嘉義，平安歸家！",
        completed: false,
        reminderEnabled: false,
        reminderMinutesBefore: 0
      }
    ]
  }
};
