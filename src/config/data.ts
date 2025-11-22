// src/config/data.ts

// 1. 【关键】在这里引入你的本地图片
// 确保你的图片已经放在 src/assets/ 目录下，并且改了个简单的名字
import pic486 from '../assets/486.webp' 
import pic4862 from '../assets/486_2.webp' 
import picdoll from '../assets/doll.webp' 
import pichd from '../assets/hd.webp' 
import piclynk from '../assets/lynk.webp' 
import picmc from '../assets/mc.webp' 
import picnoa1 from '../assets/noa1.webp' 
import picnoa2 from '../assets/noa2.webp' 
import picnoa3 from '../assets/noa3.webp' 
import picsensei from '../assets/sensei.webp' 
import pictricker from '../assets/tricker.webp' 
import picM1 from '../assets/M1.webp' 
import picM2 from '../assets/M2.webp' 
import piccar from '../assets/car.webp'
import picgm from '../assets/gm.webp'
import picwa from '../assets/wa.webp'
import pichyw from '../assets/hyw.webp'

// 如果你还有其他本地图片，也在这里引入，例如：
// import myPhoto from '../assets/magnets/photo.png'

export const profileData = {
  nickname: "KiraS",
  tagline: "Full Stack Developer / Data Engineer",
  bio: "AI真是太好用了家人们",
  // 头像也可以用同样的方法引入本地图片，或者保持网络链接
  avatarUrl: piccar, 
  socials: [
    { type: 'github', label: 'GitHub', url: 'https://github.com/kirarasmile' },
    { type: 'twitter', label: 'Twitter', url: 'https://twitter.com' },
    { type: 'email', label: 'Email', url: 'genjikira123@gmail.com' },
  ]
};

export const techStack = [
  { name: "Vue 3", level: "familiar", category: "frontend" },
  { name: "TypeScript", level: "learning", category: "frontend" },
  { name: "Vibe coding", level: "proficient", category: "frontend" },
  { name: "Node.js", level: "familiar", category: "backend" },
  { name: "Python", level: "familiar", category: "backend" },
  { name: "data analysis", level: "proficient", category: "skills" },
  { name: "data collection", level: "proficient", category: "skills" },
  { name: "ros", level: "learning", category: "skills" },
  
] as const;

export const gamesPlaying = [
  { 
    title: "Nikke", 
    platform: "PC", 
    status: "playing", 
    comment: "电脑里有一款周年庆就会死光光的游戏",
    coverUrl: picM1
  },
  { 
    title: "GF:EXILIUM", 
    platform: "PC", 
    status: "playing", 
    comment: "老后2：跑路",
    coverUrl: picwa
  },
  { 
    title: "二重螺旋", 
    platform: "PC", 
    status: "playing", 
    comment: "10年前我在拿脚本刷WF，10年后我拿脚本刷二次元WF",
    coverUrl: picgm
  }
];

// 预设磁贴图片列表
export const magnetImages = [
  { 
    id: 'm1', 
    src: pictricker, // 2. 【关键】这里直接使用上面 import 的变量名，不要加引号！
    width: 400, 
    rotation: -5,
    x: 10,
    y: 20
  },
  { 
    id: 'm2', 
    src: pichd,
    width: 140, 
    rotation: 3,
    x: 20,
    y: 500
  },
  { 
    id: 'm2', 
    src: picM2,
    width: 400, 
    rotation: -5,
    x: 20,
    y: 340
  },
  { 
    id: 'm3', 
    src: pic4862, 
    width: 400, 
    rotation: -5,
    x: 15,
    y: 195
  },
    { 
    id: 'm4', 
    src: picsensei, 
    width: 150, 
    rotation: -5,
    x: -10,
    y: 890
  },
    { 
    id: 'm5', 
    src: picdoll, 
    width: 150, 
    rotation: 0,
    x: 185,
    y: 500
  },
    { 
    id: 'm6', 
    src: piclynk, 
    width: 140, 
    rotation: 0,
    x: 360,
    y: 500 
  },
    { 
    id: 'm7', 
    src: picmc, 
    width: 150, 
    rotation: 0,
    x: 350,
    y: 640 
  },
    { 
    id: 'm8', 
    src: picnoa1, 
    width: 200, 
    rotation: 0,
    title: 'aslo my wife',
    x: 20,
    y: 670 
  }, 
    { 
    id: 'm9', 
    src: pic486, 
    width: 150, 
    rotation: 11,
    title: 'aslo my wife',
    x: 370,
    y: 860 
  }, 
    { 
    id: 'm10', 
    src: picnoa2, 
    width: 150, 
    x:200,
    y:650,
    rotation: 0,
    title: 'my wife',
  },  
    { 
    id: 'm11', 
    src: picnoa3, 
    width: 100, 
    rotation: -5,
    x: 100,
    y: 870 
  },  
    { 
    id: 'm12', 
    src: pichyw, 
    width: 100, 
    rotation: -5,
    x: 410,
    y: 10 
  },  
];

// src/config/data.ts

// ... (保留之前的 profileData, techStack, gamesPlaying, magnetImages) ...

// [新增] 工作经历
export const careerHistory = [
  {
    period: "2025.4 - PRESENT",
    company: "Engram",
    role: "Data Engineer",
    description: "负责与机器人搏斗",
    current: true // 标记为当前工作
  },
  {
    period: "2022.2 - 2022.4",
    company: "iDreamSky",
    role: "DBA",
    description: "我创建了100个版本的mysql.jpg",
    current: false
  },
  {
    period: "2021.9 - 2021.11",
    company: "ZSXQ",
    role: "DA",
    description: "表弟",
    current: false
  }
];