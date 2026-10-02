/**
 * ГОСНОМЕРА 3D — Игровой движок, генератор и оценка российских госномеров
 * По ГОСТ Р 50577-93
 */

// =============================================================================
// 1. КОНСТАНТЫ И БАЗА ДАННЫХ
// =============================================================================

// Допустимые буквы по ГОСТ (12 букв кириллицы, имеющие латинские аналоги)
const GOST_LETTERS = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];

// База данных регионов РФ
const RUS_REGIONS = [
  { code: '77', name: 'г. Москва', weight: 15, tier: 'capital' },
  { code: '99', name: 'г. Москва', weight: 12, tier: 'capital' },
  { code: '97', name: 'г. Москва', weight: 10, tier: 'capital' },
  { code: '177', name: 'г. Москва', weight: 14, tier: 'capital' },
  { code: '199', name: 'г. Москва', weight: 14, tier: 'capital' },
  { code: '197', name: 'г. Москва', weight: 12, tier: 'capital' },
  { code: '777', name: 'г. Москва (Три топора)', weight: 10, tier: 'capital' },
  { code: '799', name: 'г. Москва', weight: 15, tier: 'capital' },
  { code: '797', name: 'г. Москва', weight: 12, tier: 'capital' },
  { code: '977', name: 'г. Москва', weight: 10, tier: 'capital' },
  { code: '78', name: 'г. Санкт-Петербург', weight: 10, tier: 'major' },
  { code: '98', name: 'г. Санкт-Петербург', weight: 10, tier: 'major' },
  { code: '178', name: 'г. Санкт-Петербург', weight: 10, tier: 'major' },
  { code: '198', name: 'г. Санкт-Петербург', weight: 10, tier: 'major' },
  { code: '50', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '90', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '150', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '190', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '750', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '790', name: 'Московская область', weight: 8, tier: 'oblast' },
  { code: '16', name: 'Республика Татарстан', weight: 7, tier: 'major' },
  { code: '116', name: 'Республика Татарстан', weight: 7, tier: 'major' },
  { code: '716', name: 'Республика Татарстан', weight: 7, tier: 'major' },
  { code: '23', name: 'Краснодарский край (Сочи)', weight: 7, tier: 'major' },
  { code: '93', name: 'Краснодарский край', weight: 7, tier: 'major' },
  { code: '123', name: 'Краснодарский край', weight: 8, tier: 'major' },
  { code: '193', name: 'Краснодарский край', weight: 7, tier: 'major' },
  { code: '63', name: 'Самарская область', weight: 6, tier: 'standard' },
  { code: '163', name: 'Самарская область', weight: 6, tier: 'standard' },
  { code: '66', name: 'Свердловская область (Екатеринбург)', weight: 6, tier: 'standard' },
  { code: '96', name: 'Свердловская область', weight: 6, tier: 'standard' },
  { code: '196', name: 'Свердловская область', weight: 6, tier: 'standard' },
  { code: '54', name: 'Новосибирская область', weight: 6, tier: 'standard' },
  { code: '154', name: 'Новосибирская область', weight: 6, tier: 'standard' },
  { code: '61', name: 'Ростовская область', weight: 6, tier: 'standard' },
  { code: '161', name: 'Ростовская область', weight: 6, tier: 'standard' },
  { code: '52', name: 'Нижегородская область', weight: 6, tier: 'standard' },
  { code: '95', name: 'Чеченская Республика (Грозный)', weight: 6, tier: 'special' },
  { code: '39', name: 'Калининградская область', weight: 5, tier: 'standard' },
  { code: '82', name: 'Республика Крым', weight: 5, tier: 'standard' },
  { code: '92', name: 'г. Севастополь', weight: 5, tier: 'standard' },
  { code: '25', name: 'Приморский край (Владивосток)', weight: 5, tier: 'standard' },
  { code: '01', name: 'Республика Адыгея', weight: 4, tier: 'standard' },
  { code: '02', name: 'Республика Башкортостан', weight: 5, tier: 'standard' },
  { code: '05', name: 'Республика Дагестан', weight: 5, tier: 'standard' },
  { code: '34', name: 'Волгоградская область', weight: 5, tier: 'standard' },
  { code: '36', name: 'Воронежская область', weight: 5, tier: 'standard' },
  { code: '42', name: 'Кемеровская область (Кузбасс)', weight: 5, tier: 'standard' },
  { code: '74', name: 'Челябинская область', weight: 5, tier: 'standard' }
];

// Автомобили в гараже
const CARS_DATABASE = [
  {
    id: 'mercedes',
    name: 'Mercedes-Benz S-Class W222',
    desc: 'Президентский флагман с трехлучевой звездой и хромом',
    price: 0,
    unlocked: true,
    img: 'mercedes_clean.jpg',
    platePosition: {
      left: '50%',
      top: '49.8%',
      width: '92%',
      aspectRatio: '580 / 125',
      transform: 'translate(-50%, -50%)'
    }
  },
  {
    id: 'gelik',
    name: 'Mercedes-Benz G63 AMG "Гелик"',
    desc: 'Матовый броневик для авторитетных номеров серии ВОР и АМР',
    price: 15000000,
    unlocked: false,
    img: 'gelik_g63.jpg',
    platePosition: {
      left: '67.2%',
      top: '50.1%',
      width: '18.2%',
      aspectRatio: '580 / 125',
      transform: 'translate(-50%, -50%)'
    }
  },
  {
    id: 'bmw_m5',
    name: 'BMW M5 F90 Competition',
    desc: 'Спортивный хищник с карбоновым диффузором',
    price: 8500000,
    unlocked: false,
    img: 'bmw_m5.jpg',
    platePosition: {
      left: '62.8%',
      top: '33.4%',
      width: '14.4%',
      aspectRatio: '580 / 125',
      transform: 'translate(-50%, -50%)'
    }
  },
  {
    id: 'priora',
    name: 'Lada Priora Black Edition',
    desc: 'Легендарный опер-стайл, глухая тонировка вкруг',
    price: 450000,
    unlocked: false,
    img: 'lada_priora.jpg',
    platePosition: {
      left: '68%',
      top: '53.2%',
      width: '14.5%',
      aspectRatio: '580 / 125',
      transform: 'translate(-50%, -50%)'
    }
  },
  {
    id: 'rolls',
    name: 'Rolls-Royce Cullinan VIP',
    desc: 'Ультра-роскошный дворец на колесах для правительственных номеров',
    price: 45000000,
    unlocked: false,
    img: 'rolls_royce.jpg',
    platePosition: {
      left: '59.2%',
      top: '48.3%',
      width: '17.8%',
      aspectRatio: '580 / 125',
      transform: 'translate(-50%, -50%)'
    }
  }
];

// Уровни игрока (Ранги)
const PLAYER_RANKS = [
  { minNetWorth: 0, title: 'Пешеход без прав', badge: 'Ученик' },
  { minNetWorth: 50000, title: 'Владелец Жигулей', badge: 'Любитель' },
  { minNetWorth: 250000, title: 'Оперуполномоченный', badge: 'Опер' },
  { minNetWorth: 1000000, title: 'Перекуп с Авито', badge: 'Бизнесмен' },
  { minNetWorth: 5000000, title: 'Мажор на БМВ', badge: 'Стритрейсер' },
  { minNetWorth: 15000000, title: 'Авторитетный коммерсант', badge: 'Элита' },
  { minNetWorth: 40000000, title: 'Чиновник из Мэрии', badge: 'Госслужащий' },
  { minNetWorth: 100000000, title: 'Олигарх с мигалкой', badge: 'Хозяин жизни' }
];

// =============================================================================
// 2. ПРОЦЕДУРНЫЙ ЗВУКОВОЙ ДВИЖОК (WEB AUDIO API)
// =============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Механический щелчок барабана
  playTick(pitchOffset = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + pitchOffset, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Звук фиксации слота (Клац)
  playLock() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  }

  // Звук победы / редкости
  playWin(tier) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (tier === 'common' || tier === 'uncommon') {
      // Приятный аккорд
      [523.25, 659.25].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } else if (tier === 'rare' || tier === 'epic') {
      // Мажорный тритон (C-E-G-C5)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.3, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.5);
      });
    } else {
      // Легендарный / Мифический фанфар!
      const chords = [
        [523.25, 659.25, 783.99],
        [659.25, 783.99, 987.77],
        [783.99, 987.77, 1174.66],
        [1046.50, 1318.51, 1567.98]
      ];
      chords.forEach((chord, step) => {
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          const t = now + step * 0.12;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.65);
        });
      });
    }
  }

  // Звон монет / касса
  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [1760, 2637].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.25, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.4);
    });
  }

  // Звук закручивания болта
  playMount() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(450, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Звук рычания мотора
  playRev() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.6);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }
}

const audio = new SoundFX();

// =============================================================================
// 3. ЭКСПЕРТНЫЙ ДВИЖОК ОЦЕНКИ НОМЕРОВ (VALUATION ENGINE)
// =============================================================================

class ValuationEngine {
  static evaluate(letter1, digits, letter2, letter3, regionCode) {
    const letters = `${letter1}${letter2}${letter3}`;
    const fullPlate = `${letter1}${digits}${letter2}${letter3} ${regionCode}`;
    const regionObj = RUS_REGIONS.find(r => r.code === regionCode) || {
      code: regionCode,
      name: `Регион ${regionCode}`,
      tier: 'standard'
    };

    let baseDigitsPrice = 2500;
    let baseLettersPrice = 0;
    let regionMultiplier = 1.0;
    let comboMultiplier = 1.0;
    let tier = 'common'; // common, uncommon, rare, epic, legendary, mythic
    let digitsTitle = 'Обычные цифры';
    let lettersTitle = 'Обычная серия';
    let comboTitle = '';
    let lore = 'Стандартный государственный регистрационный номер. Выдаётся в порядке общей электронной очереди в МРЭО ГИБДД.';

    const d = digits.toString();
    const d1 = d[0], d2 = d[1], d3 = d[2];

    // --- 1. АНАЛИЗ ЦИФР ---
    if (d === '777') {
      baseDigitsPrice = 5000000;
      digitsTitle = '«Три топора» (777)';
      tier = 'legendary';
      lore = 'Культовые «Три топора» — самый узнаваемый и авторитетный номер на постсоветском пространстве. Символ безупречного фарта и достатка.';
    } else if (d === '001') {
      baseDigitsPrice = 4500000;
      digitsTitle = '«Первый номер» (001)';
      tier = 'legendary';
      lore = '«Первый номер» традиционно закрепляется за первыми лицами: главами регионов, руководителями министерств и ведомств.';
    } else if (d === '007') {
      baseDigitsPrice = 2000000;
      digitsTitle = '«Агент 007» (007)';
      tier = 'rare';
      lore = 'Знаменитый номер «Джеймс Бонд». Колоссальный спрос среди владельцев спорткаров и премиальных купе.';
    } else if (d === '666') {
      baseDigitsPrice = 1800000;
      digitsTitle = '«Три шестерки / Зверь» (666)';
      tier = 'rare';
      lore = 'Дерзкий мистический номер. Пользуется бешеной популярностью у золотой молодежи и любителей агрессивной езды.';
    } else if (d === '999') {
      baseDigitsPrice = 2500000;
      digitsTitle = '«Три девятки» (999)';
      tier = 'epic';
      lore = 'Три девятки — максимальное числовое значение. Символ высшего статуса и завершенности.';
    } else if (d1 === d2 && d2 === d3) {
      baseDigitsPrice = 1600000;
      digitsTitle = `Одинаковые цифры (${d})`;
      tier = 'epic';
      lore = 'Красивый номер с тремя одинаковыми цифрами. Заметен в потоке за сотни метров.';
    } else if (d1 === '0' && d2 === '0') {
      baseDigitsPrice = 750000;
      digitsTitle = `«Первая десятка» (${d})`;
      tier = 'rare';
      lore = 'Номера первой десятки (002-009) подчеркивают принадлежность к руководящему звену автоинспекции.';
    } else if (d2 === '0' && d3 === '0') {
      baseDigitsPrice = 400000;
      digitsTitle = `«Круглая сотня» (${d})`;
      tier = 'rare';
      lore = '«Сотки» — нестареющая строгая классика для черных представительских седанов.';
    } else if (d1 === d3 && d1 !== d2) {
      baseDigitsPrice = 120000;
      digitsTitle = `«Зеркалка» (${d})`;
      tier = 'uncommon';
      lore = 'Симметричный номер-зеркалка. Радует глаз и легко запоминается инспекторами и водителями.';
    } else if (
      (parseInt(d2) === parseInt(d1) + 1 && parseInt(d3) === parseInt(d2) + 1) ||
      (d === '789')
    ) {
      baseDigitsPrice = 250000;
      digitsTitle = `«Лесенка» (${d})`;
      tier = 'rare';
      lore = 'Восходящая лесенка цифр — признак математического вкуса и редкая удача при регистрации.';
    } else if (d1 === '0' || d3 === '0') {
      baseDigitsPrice = 35000;
      digitsTitle = `Красивая пара (${d})`;
      tier = 'uncommon';
    }

    // --- 2. АНАЛИЗ БУКВЕННЫХ СЕРИЙ ---
    const isCapitalRegion = ['77', '97', '99', '177', '197', '199', '777', '797', '799', '977'].includes(regionCode);

    if (letters === 'АМР') {
      if (regionCode === '97') {
        baseLettersPrice = 30000000;
        lettersTitle = 'А-МР 97 • Главная спецсерия России';
        tier = 'mythic';
        lore = 'СВЯЩЕННЫЙ ГРААЛЬ РОССИЙСКИХ ДОРОГ! Серия закреплена за Администрацией Президента, ФСБ, ФСО, Советом Федерации и Правительством РФ. Абсолютная дорожная неприкосновенность.';
      } else if (isCapitalRegion) {
        baseLettersPrice = 14000000;
        lettersTitle = `А-МР ${regionCode} • Силовая элита Москвы`;
        tier = 'legendary';
        lore = 'Столичные АМР — престижнейшие ведомственные номера силовых министерств и руководства главков.';
      } else {
        baseLettersPrice = 6000000;
        lettersTitle = `А-МР ${regionCode} • Губернаторская серия`;
        tier = 'epic';
        lore = 'Серия АМР в регионах традиционно принадлежит руководству областных администраций и силовикам.';
      }
    } else if (letters === 'ЕКХ') {
      if (isCapitalRegion) {
        baseLettersPrice = 22000000;
        lettersTitle = 'Е-КХ • Федеральная Служба Охраны (ФСО)';
        tier = 'mythic';
        lore = 'Легендарные номера ФСО России. В народе расшифровываются как «Еду Как Хочу». Экипажи ДПС отдают честь при проезде этих машин.';
      } else {
        baseLettersPrice = 8000000;
        lettersTitle = `Е-КХ ${regionCode} • Спецслужба региона`;
        tier = 'legendary';
        lore = 'Региональная серия Федеральной службы охраны. Защита от проверок на постах гарантирована.';
      }
    } else if (letters === 'ААА') {
      baseLettersPrice = 6500000;
      lettersTitle = '«Три Анны» (ААА) • Администрация Президента';
      tier = 'legendary';
      lore = '«Три Анны» — историческая номенклатурная серия высшего чиновничества Москвы и кремлевского гаража.';
    } else if (letters === 'ООО') {
      baseLettersPrice = 5000000;
      lettersTitle = '«Три Ольги» (ООО) • ФСБ и спецслужбы';
      tier = 'legendary';
      lore = '«Три Ольги» — классическая серия ФСБ и крупных государственных корпораций.';
    } else if (letters === 'МММ') {
      baseLettersPrice = 4500000;
      lettersTitle = '«Три Михаила» (МММ) • МВД России';
      tier = 'epic';
      lore = '«Три Михаила» — серия Московского ГУВД и столичной полиции. Гарантия глубокого уважения на дороге.';
    } else if (letters === 'ССС') {
      baseLettersPrice = 4000000;
      lettersTitle = '«Три Семёна» (ССС) • Спецсвязь и Мэрия';
      tier = 'epic';
      lore = '«Три Семена» — Центральный узел спецсвязи РФ и Правительство Москвы.';
    } else if (letters === 'ВОР') {
      baseLettersPrice = 5500000;
      lettersTitle = 'В***ОР • Культовая «Воровская» серия';
      tier = 'legendary';
      lore = 'Самая дерзкая и авторитетная серия в стране. Владельцы черных Гелендвагенов и тонированных Мерседесов готовы платить за нее любые деньги.';
    } else if (letters === 'ХАМ') {
      baseLettersPrice = 2200000;
      lettersTitle = 'Х***АМ • Хулиганская серия';
      tier = 'epic';
      lore = 'Дерзкая серия ХАМ для тех, кто не привык стоять в пробках и уступать полосу.';
    } else if (letters === 'СКР') {
      baseLettersPrice = 3000000;
      lettersTitle = 'С-КР • Следственный комитет РФ';
      tier = 'epic';
      lore = 'Серия центрального аппарата Следственного комитета Российской Федерации.';
    } else if (letters === 'АМО') {
      baseLettersPrice = 2000000;
      lettersTitle = 'А-МО • Мэрия и автобаза Москвы';
      tier = 'rare';
      lore = 'Серия столичных департаментов и аппарата Правительства Москвы.';
    } else if (letter1 === letter2 && letter2 === letter3) {
      baseLettersPrice = 2800000;
      lettersTitle = `Три одинаковые буквы (${letters})`;
      tier = tier === 'common' || tier === 'uncommon' ? 'epic' : tier;
      lore = `Редкая моносерия с одинаковыми буквами «${letters}». На вторичном рынке за такими комплектами идет охота.`;
    } else if (letter1 === letter3) {
      baseLettersPrice = 300000;
      lettersTitle = `Зеркальные буквы (${letter1}...${letter2}${letter3})`;
      if (tier === 'common') tier = 'uncommon';
    } else if (['КОТ', 'НЕТ', 'РУС', 'СТО', 'ТОР'].includes(letters)) {
      baseLettersPrice = 450000;
      lettersTitle = `Серия со словом «${letters}»`;
      if (tier === 'common') tier = 'uncommon';
    }

    // --- 3. РЕГИОНАЛЬНЫЙ КОЭФФИЦИЕНТ ---
    if (isCapitalRegion) {
      regionMultiplier = 2.8;
    } else if (['78', '98', '178', '198'].includes(regionCode)) {
      regionMultiplier = 2.0;
    } else if (regionCode === '95') {
      regionMultiplier = 2.2;
    } else if (['23', '93', '123', '193'].includes(regionCode)) {
      regionMultiplier = 1.6;
    } else if (['16', '116', '716'].includes(regionCode)) {
      regionMultiplier = 1.4;
    } else {
      regionMultiplier = 1.1;
    }

    // --- 4. СУПЕР-КОМБО И БИНГО ---
    // Совпадение цифр с кодом региона! (e.g. 777 777 или 199 199)
    if (d === regionCode) {
      comboMultiplier *= 2.2;
      comboTitle = `🔥 Фулл Бинго! Цифры совпадают с регионом (${d} ${regionCode})!`;
      tier = tier === 'mythic' ? 'mythic' : 'legendary';
      lore = `НЕВЕРОЯТНОЕ СОВПАДЕНИЕ! Номер ${d} на регионе ${regionCode}! За такой комплект коллекционеры на закрытых аукционах платят тройную цену.`;
    }

    // Абсолютный Олимп: А777АА 777 или А001АА 777
    if (letters === 'ААА' && (d === '777' || d === '001') && isCapitalRegion) {
      comboMultiplier *= 2.5;
      tier = 'mythic';
      comboTitle = '👑 АБСОЛЮТНЫЙ ДЖЕКПОТ РОССИИ!';
      lore = 'ВЕРШИНА ВЛАСТИ И АВТОРИТЕТА! Номер представительского класса на столичном элитном коде региона. Бесценный актив на российских дорогах.';
    }

    // Расчет финальной суммы с округлением
    let rawPrice = (baseDigitsPrice + baseLettersPrice) * regionMultiplier * comboMultiplier;
    
    // Округление до красивых чисел
    let finalPrice;
    if (rawPrice < 50000) {
      finalPrice = Math.round(rawPrice / 500) * 500;
    } else if (rawPrice < 1000000) {
      finalPrice = Math.round(rawPrice / 5000) * 5000;
    } else if (rawPrice < 10000000) {
      finalPrice = Math.round(rawPrice / 50000) * 50000;
    } else {
      finalPrice = Math.round(rawPrice / 100000) * 100000;
    }

    if (finalPrice < 2500) finalPrice = 2500;

    // Автокоррекция тира по цене
    if (finalPrice >= 18000000) tier = 'mythic';
    else if (finalPrice >= 4000000) tier = 'legendary';
    else if (finalPrice >= 1200000) tier = 'epic';
    else if (finalPrice >= 300000) tier = 'rare';
    else if (finalPrice >= 40000) tier = 'uncommon';
    else tier = 'common';

    const tierData = {
      common: { name: 'Обычный', color: '#bdc3c7', glow: 'rgba(189, 195, 199, 0.4)' },
      uncommon: { name: 'Необычный', color: '#2ecc71', glow: 'rgba(46, 204, 113, 0.5)' },
      rare: { name: 'Редкий', color: '#3498db', glow: 'rgba(52, 152, 219, 0.6)' },
      epic: { name: 'Эпический', color: '#9b59b6', glow: 'rgba(155, 89, 182, 0.7)' },
      legendary: { name: 'Легендарный', color: '#f39c12', glow: 'rgba(243, 156, 18, 0.8)' },
      mythic: { name: 'Гос-Олимп', color: '#e74c3c', glow: 'rgba(231, 76, 60, 0.9)' }
    };

    return {
      fullPlate,
      letter1,
      digits,
      letter2,
      letter3,
      regionCode,
      regionName: regionObj.name,
      finalPrice,
      tier,
      tierInfo: tierData[tier],
      digitsTitle,
      baseDigitsPrice,
      lettersTitle,
      baseLettersPrice,
      regionMultiplier,
      comboMultiplier,
      comboTitle,
      lore
    };
  }
}

// =============================================================================
// 4. ОСНОВНОЙ КЛАСС ИГРЫ (APP STATE)
// =============================================================================

class NomeraGame {
  constructor() {
    this.balance = 50000;
    this.totalEarned = 0;
    this.totalSpins = 0;
    this.bestPlatePrice = 0;
    this.activeCarId = 'mercedes';
    this.viewMode = 'stand'; // 'stand' (3D Close-up) или 'car' (On Car)
    
    // Кастомизация номера
    this.frameText = '• УПРАВЛЕНИЕ ДЕЛАМИ ПРЕЗИДЕНТА РФ •';
    this.boltType = 'gold'; // 'gold', 'chrome', 'black'
    this.hasFlag = true;

    // Перки / Улучшения игрока
    this.perks = {
      major: 0,      // +% зеркалок и соток
      specialSeries: 0, // +% одинаковых букв
      kremlinCall: 0,   // шанс АМР и ЕКХ
      moscowProp: 0     // шанс столичных регионов
    };

    // Текущий номер
    this.currentPlate = {
      letter1: 'А',
      digits: '695',
      letter2: 'К',
      letter3: 'А',
      regionCode: '799'
    };

    this.currentEvaluation = null;
    this.inventory = [];
    this.cars = JSON.parse(JSON.stringify(CARS_DATABASE));
    this.isSpinning = false;
    this.autoRollActive = false;

    this.initStorage();
    this.bindEvents();
    this.renderInitialState();
  }

  // Загрузка и сохранение состояния в localStorage
  initStorage() {
    try {
      const saved = localStorage.getItem('nomera_game_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.balance !== undefined) this.balance = data.balance;
        if (data.totalEarned !== undefined) this.totalEarned = data.totalEarned;
        if (data.totalSpins !== undefined) this.totalSpins = data.totalSpins;
        if (data.bestPlatePrice !== undefined) this.bestPlatePrice = data.bestPlatePrice;
        if (data.activeCarId) this.activeCarId = data.activeCarId;
        if (data.frameText) this.frameText = data.frameText;
        if (data.boltType) this.boltType = data.boltType;
        if (data.hasFlag !== undefined) this.hasFlag = data.hasFlag;
        if (data.perks) this.perks = Object.assign(this.perks, data.perks);
        if (data.inventory) this.inventory = data.inventory;
        if (data.cars) {
          data.cars.forEach(savedCar => {
            const car = this.cars.find(c => c.id === savedCar.id);
            if (car) car.unlocked = savedCar.unlocked;
          });
        }
        if (data.currentPlate) this.currentPlate = data.currentPlate;
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }

  saveStorage() {
    try {
      const data = {
        balance: this.balance,
        totalEarned: this.totalEarned,
        totalSpins: this.totalSpins,
        bestPlatePrice: this.bestPlatePrice,
        activeCarId: this.activeCarId,
        frameText: this.frameText,
        boltType: this.boltType,
        hasFlag: this.hasFlag,
        perks: this.perks,
        inventory: this.inventory,
        cars: this.cars.map(c => ({ id: c.id, unlocked: c.unlocked })),
        currentPlate: this.currentPlate
      };
      localStorage.setItem('nomera_game_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  // =============================================================================
  // 5. ГЕНЕРАТОР НОМЕРОВ С УЧЕТОМ ПЕРКОВ
  // =============================================================================
  generateRandomPlate() {
    const rnd = Math.random();

    let l1, l2, l3;
    let d;
    let reg;

    // 1. Буквы
    const kremlinChance = 0.01 + this.perks.kremlinCall * 0.03;
    const sameLettersChance = 0.03 + this.perks.specialSeries * 0.05;

    if (Math.random() < kremlinChance) {
      // Спецсерия высшего ранга
      const topPicks = ['АМР', 'ЕКХ', 'ВОР', 'ААА', 'ООО', 'МММ'];
      const chosen = topPicks[Math.floor(Math.random() * topPicks.length)];
      l1 = chosen[0];
      l2 = chosen[1];
      l3 = chosen[2];
    } else if (Math.random() < sameLettersChance) {
      // Одинаковые три буквы
      const letter = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
      l1 = letter;
      l2 = letter;
      l3 = letter;
    } else {
      l1 = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
      l2 = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
      l3 = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
    }

    // 2. Цифры
    const majorChance = 0.05 + this.perks.major * 0.08;
    const jackChance = 0.015;

    if (Math.random() < jackChance) {
      // Джекпот-числа
      const jackpotNumbers = ['777', '001', '007', '999', '666', '111', '555'];
      d = jackpotNumbers[Math.floor(Math.random() * jackpotNumbers.length)];
    } else if (Math.random() < majorChance) {
      // Зеркалки или сотки
      if (Math.random() < 0.5) {
        // Зеркалка (например, 707, 121, 585)
        const outer = Math.floor(Math.random() * 9) + 1;
        const mid = Math.floor(Math.random() * 10);
        d = `${outer}${mid}${outer}`;
      } else {
        // Круглая сотня (100, 200...)
        const n = Math.floor(Math.random() * 9) + 1;
        d = `${n}00`;
      }
    } else {
      // Случайное трехзначное от 001 до 999
      const num = Math.floor(Math.random() * 999) + 1;
      d = num.toString().padStart(3, '0');
    }

    // 3. Регион
    const moscowBonus = this.perks.moscowProp * 15;
    const pool = [];
    RUS_REGIONS.forEach(regItem => {
      let weight = regItem.weight;
      if (regItem.tier === 'capital') {
        weight += moscowBonus;
      }
      for (let i = 0; i < weight; i++) {
        pool.push(regItem.code);
      }
    });

    reg = pool[Math.floor(Math.random() * pool.length)];

    return { letter1: l1, digits: d, letter2: l2, letter3: l3, regionCode: reg };
  }

  // =============================================================================
  // 6. ИГРОВЫЕ МЕХАНИКИ (СПИН, РУЛЕТКА, АВТО-КРУТКА)
  // =============================================================================
  async rollPlate(cost = 2500) {
    if (this.isSpinning) return;
    if (this.balance < cost) {
      this.showToast('Недостаточно рублей! Получите субсидию или продайте номер из гаража.');
      if (this.autoRollActive) this.stopAutoRoll();
      return;
    }

    this.balance -= cost;
    this.totalSpins++;
    this.updateBalanceUI();
    this.isSpinning = true;
    this.disableRollButtons(true);

    const generated = this.generateRandomPlate();
    const evaluation = ValuationEngine.evaluate(
      generated.letter1,
      generated.digits,
      generated.letter2,
      generated.letter3,
      generated.regionCode
    );

    // Запуск механического барабана
    await this.animatePlateRoll(generated, evaluation);

    this.currentPlate = generated;
    this.currentEvaluation = evaluation;
    this.isSpinning = false;
    this.disableRollButtons(false);

    if (evaluation.finalPrice > this.bestPlatePrice) {
      this.bestPlatePrice = evaluation.finalPrice;
    }
    this.saveStorage();

    // Звук выигрыша
    audio.playWin(evaluation.tier);

    // Рендер оценки
    this.renderAppraisal(evaluation);

    // Если авто-крутка
    if (this.autoRollActive) {
      const stopTiers = ['rare', 'epic', 'legendary', 'mythic'];
      if (stopTiers.includes(evaluation.tier)) {
        this.stopAutoRoll();
        this.showToast(`🎯 Авто-крутка остановилась! Выбит номер уровня: ${evaluation.tierInfo.name}!`);
      } else {
        setTimeout(() => {
          if (this.autoRollActive) this.rollPlate(cost);
        }, 350);
      }
    }
  }

  // Анимация вращения барабана
  animatePlateRoll(target, evaluation) {
    return new Promise(resolve => {
      const stage = document.getElementById('stageContainer');
      const plateWrapper = document.getElementById('plateWrapper');
      plateWrapper.classList.add('is-spinning');

      const elL1 = document.getElementById('plateLetter1');
      const elDigits = document.getElementById('plateDigits');
      const elL2 = document.getElementById('plateLettersEnd');
      const elReg = document.getElementById('plateRegionDigits');

      let ticks = 0;
      const maxTicks = 20;
      const intervalMs = 60;

      const timer = setInterval(() => {
        ticks++;
        audio.playTick(ticks * 20);

        // Случайные символы на вращении
        if (ticks < 8) {
          elL1.textContent = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
        } else if (ticks === 8) {
          elL1.textContent = target.letter1;
          audio.playLock();
        }

        if (ticks < 12) {
          const randNum = Math.floor(Math.random() * 900 + 100);
          elDigits.textContent = randNum.toString();
        } else if (ticks === 12) {
          elDigits.textContent = target.digits;
          audio.playLock();
        }

        if (ticks < 16) {
          const lA = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
          const lB = GOST_LETTERS[Math.floor(Math.random() * GOST_LETTERS.length)];
          elL2.textContent = `${lA}${lB}`;
        } else if (ticks === 16) {
          elL2.textContent = `${target.letter2}${target.letter3}`;
          audio.playLock();
        }

        if (ticks < maxTicks) {
          const randReg = RUS_REGIONS[Math.floor(Math.random() * RUS_REGIONS.length)].code;
          elReg.textContent = randReg;
        } else {
          elReg.textContent = target.regionCode;
          audio.playLock();
          clearInterval(timer);

          plateWrapper.classList.remove('is-spinning');
          plateWrapper.classList.add('plate-impact-anim');
          setTimeout(() => plateWrapper.classList.remove('plate-impact-anim'), 400);

          // Обновление свечения в тон редкости
          const stageGlow = document.getElementById('stageGlow');
          stageGlow.style.setProperty('--rarity-glow', evaluation.tierInfo.glow);

          resolve();
        }
      }, intervalMs);
    });
  }

  // Быстрый дроп x5
  async rollMulti(count = 5) {
    const cost = 2500 * count;
    if (this.balance < cost) {
      this.showToast('Недостаточно средств для мульти-дропа!');
      return;
    }

    this.balance -= cost;
    this.totalSpins += count;
    this.updateBalanceUI();

    let bestOne = null;
    for (let i = 0; i < count; i++) {
      const generated = this.generateRandomPlate();
      const evalItem = ValuationEngine.evaluate(
        generated.letter1,
        generated.digits,
        generated.letter2,
        generated.letter3,
        generated.regionCode
      );
      if (!bestOne || evalItem.finalPrice > bestOne.finalPrice) {
        bestOne = evalItem;
      }
      this.inventory.unshift({
        id: Date.now() + i,
        plate: evalItem,
        date: new Date().toLocaleDateString('ru-RU')
      });
    }

    this.currentPlate = {
      letter1: bestOne.letter1,
      digits: bestOne.digits,
      letter2: bestOne.letter2,
      letter3: bestOne.letter3,
      regionCode: bestOne.regionCode
    };
    this.currentEvaluation = bestOne;

    this.renderPlateUI();
    this.renderAppraisal(bestOne);
    audio.playWin(bestOne.tier);
    this.saveStorage();
    this.showToast(`🔥 Открыт пак из 5 номеров! Лучший: ${bestOne.fullPlate} (${bestOne.finalPrice.toLocaleString('ru-RU')} ₽)`);
  }

  // Авто-крутка
  toggleAutoRoll() {
    if (this.autoRollActive) {
      this.stopAutoRoll();
    } else {
      this.autoRollActive = true;
      const btn = document.getElementById('btnAutoRoll');
      btn.classList.add('auto-roll-active');
      btn.innerHTML = '<span>⏹️</span> ОСТАНОВИТЬ АВТО-КРУТКУ';
      this.rollPlate(2500);
    }
  }

  stopAutoRoll() {
    this.autoRollActive = false;
    const btn = document.getElementById('btnAutoRoll');
    btn.classList.remove('auto-roll-active');
    btn.innerHTML = '<span>⚡</span> АВТО-КРУТКА ДО КУША';
  }

  // =============================================================================
  // 7. ЭКОНОМИКА: ПРОДАЖА, СОХРАНЕНИЕ, ГАРАЖ
  // =============================================================================
  sellCurrentPlate() {
    if (!this.currentEvaluation) return;
    const price = this.currentEvaluation.finalPrice;
    this.balance += price;
    this.totalEarned += price;
    this.updateBalanceUI();
    audio.playCoin();
    this.showToast(`💰 Номер ${this.currentEvaluation.fullPlate} продан перекупщикам за +${price.toLocaleString('ru-RU')} ₽!`);
    
    // Скрываем карточку или обновляем кнопку
    const sellBtn = document.getElementById('btnSellPlate');
    if (sellBtn) {
      sellBtn.disabled = true;
      sellBtn.textContent = '✅ ПРОДАНО';
    }
    this.saveStorage();
  }

  saveCurrentPlateToGarage() {
    if (!this.currentEvaluation) return;
    const exists = this.inventory.some(item => item.plate.fullPlate === this.currentEvaluation.fullPlate);
    if (exists) {
      this.showToast('Этот номер уже находится в вашем гараже!');
      return;
    }

    this.inventory.unshift({
      id: Date.now(),
      plate: this.currentEvaluation,
      date: new Date().toLocaleDateString('ru-RU')
    });
    audio.playMount();
    this.saveStorage();
    this.showToast(`📥 Номер ${this.currentEvaluation.fullPlate} бережно сохранён в личный гараж!`);

    const saveBtn = document.getElementById('btnSavePlate');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = '✅ В ГАРАЖЕ';
    }
  }

  sellInventoryPlate(id) {
    const idx = this.inventory.findIndex(item => item.id === id);
    if (idx === -1) return;
    const item = this.inventory[idx];
    this.balance += item.plate.finalPrice;
    this.totalEarned += item.plate.finalPrice;
    this.inventory.splice(idx, 1);
    this.updateBalanceUI();
    this.renderInventoryModal();
    audio.playCoin();
    this.saveStorage();
    this.showToast(`Продано за +${item.plate.finalPrice.toLocaleString('ru-RU')} ₽!`);
  }

  equipInventoryPlate(id) {
    const item = this.inventory.find(i => i.id === id);
    if (!item) return;
    this.currentPlate = {
      letter1: item.plate.letter1,
      digits: item.plate.digits,
      letter2: item.plate.letter2,
      letter3: item.plate.letter3,
      regionCode: item.plate.regionCode
    };
    this.currentEvaluation = item.plate;
    this.renderPlateUI();
    this.renderAppraisal(item.plate);
    audio.playMount();
    this.saveStorage();
    this.closeAllModals();
    this.showToast(`🚘 Номер ${item.plate.fullPlate} установлен на автомобиль!`);
  }

  buyCar(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (!car || car.unlocked) return;
    if (this.balance < car.price) {
      this.showToast('Недостаточно средств для покупки этого автомобиля!');
      return;
    }

    this.balance -= car.price;
    car.unlocked = true;
    this.activeCarId = car.id;
    this.updateBalanceUI();
    this.renderCarSelectUI();
    this.renderCarsModal();
    audio.playRev();
    this.saveStorage();
    this.showToast(`🎉 Поздравляем! Вы приобрели ${car.name}!`);
  }

  selectCar(carId) {
    this.activeCarId = carId;
    this.updateCarView();
    audio.playRev();
    this.saveStorage();
  }

  buyPerk(perkKey) {
    const costs = {
      major: 75000,
      specialSeries: 350000,
      kremlinCall: 1500000,
      moscowProp: 500000
    };
    const cost = costs[perkKey];
    if (this.balance < cost) {
      this.showToast('Недостаточно рублей для прокачки связей!');
      return;
    }

    this.balance -= cost;
    this.perks[perkKey] = (this.perks[perkKey] || 0) + 1;
    this.updateBalanceUI();
    this.renderPerksModal();
    audio.playCoin();
    this.saveStorage();
    this.showToast('Связи в МРЭО успешно улучшены!');
  }

  // =============================================================================
  // 8. РЕНДЕР И ОБНОВЛЕНИЕ UI
  // =============================================================================
  renderInitialState() {
    this.updateBalanceUI();
    this.renderPlateUI();
    this.renderCarSelectUI();
    this.applyCustomizerSettings();

    // Первая оценка текущего номера
    const initialEval = ValuationEngine.evaluate(
      this.currentPlate.letter1,
      this.currentPlate.digits,
      this.currentPlate.letter2,
      this.currentPlate.letter3,
      this.currentPlate.regionCode
    );
    this.currentEvaluation = initialEval;
    this.renderAppraisal(initialEval);
  }

  updateBalanceUI() {
    const elBal = document.getElementById('userBalance');
    if (elBal) elBal.textContent = `${this.balance.toLocaleString('ru-RU')} ₽`;

    // Расчет ранга игрока
    const netWorth = this.balance + this.totalEarned;
    let currentRank = PLAYER_RANKS[0];
    for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
      if (netWorth >= PLAYER_RANKS[i].minNetWorth) {
        currentRank = PLAYER_RANKS[i];
        break;
      }
    }
    const elRank = document.getElementById('userRank');
    if (elRank) elRank.textContent = currentRank.title;
    const elBadge = document.getElementById('userBadge');
    if (elBadge) elBadge.textContent = currentRank.badge;
  }

  renderPlateUI() {
    const l1 = this.currentPlate.letter1;
    const d = this.currentPlate.digits;
    const l2 = `${this.currentPlate.letter2}${this.currentPlate.letter3}`;
    const reg = this.currentPlate.regionCode;

    document.getElementById('plateLetter1').textContent = l1;
    document.getElementById('plateDigits').textContent = d;
    document.getElementById('plateLettersEnd').textContent = l2;
    document.getElementById('plateRegionDigits').textContent = reg;

    const cL1 = document.getElementById('carPlateLetter1');
    const cD = document.getElementById('carPlateDigits');
    const cL2 = document.getElementById('carPlateLettersEnd');
    const cReg = document.getElementById('carPlateRegionDigits');
    if (cL1) cL1.textContent = l1;
    if (cD) cD.textContent = d;
    if (cL2) cL2.textContent = l2;
    if (cReg) cReg.textContent = reg;

    this.updateCarView();
  }

  updateCarView() {
    const car = this.cars.find(c => c.id === this.activeCarId) || this.cars[0];
    const carImg = document.getElementById('carBgImg');
    const mountedPlate = document.getElementById('carMountedPlate');

    if (carImg) carImg.src = car.img;
    if (mountedPlate && car.platePosition) {
      mountedPlate.style.left = car.platePosition.left;
      mountedPlate.style.top = car.platePosition.top;
      mountedPlate.style.width = car.platePosition.width;
      mountedPlate.style.transform = car.platePosition.transform;
    }
  }

  renderAppraisal(evaluation) {
    const card = document.getElementById('appraisalCard');
    if (!card) return;

    card.style.setProperty('--rarity-color', evaluation.tierInfo.color);
    card.style.setProperty('--rarity-glow', evaluation.tierInfo.glow);

    document.getElementById('appraisalRarityBadge').textContent = evaluation.tierInfo.name;
    document.getElementById('appraisalRarityBadge').style.background = evaluation.tierInfo.color;

    // Анимация счета цены
    const priceEl = document.getElementById('appraisalPrice');
    this.animateNumber(priceEl, evaluation.finalPrice);

    // Сетка разбора
    document.getElementById('breakdownLettersVal').textContent = evaluation.lettersTitle;
    document.getElementById('breakdownLettersBonus').textContent = evaluation.baseLettersPrice > 0 
      ? `+${evaluation.baseLettersPrice.toLocaleString('ru-RU')} ₽` 
      : 'Базовая';

    document.getElementById('breakdownDigitsVal').textContent = evaluation.digitsTitle;
    document.getElementById('breakdownDigitsBonus').textContent = `+${evaluation.baseDigitsPrice.toLocaleString('ru-RU')} ₽`;

    document.getElementById('breakdownRegionVal').textContent = evaluation.regionName;
    document.getElementById('breakdownRegionBonus').textContent = `x${evaluation.regionMultiplier} коэф.`;

    const comboRow = document.getElementById('breakdownComboItem');
    if (evaluation.comboTitle) {
      comboRow.style.display = 'flex';
      document.getElementById('breakdownComboVal').textContent = evaluation.comboTitle;
      document.getElementById('breakdownComboBonus').textContent = `x${evaluation.comboMultiplier.toFixed(1)} БОНУС!`;
    } else {
      comboRow.style.display = 'none';
    }

    // Историческая справка
    document.getElementById('appraisalLore').textContent = evaluation.lore;

    // Сброс кнопок
    const sellBtn = document.getElementById('btnSellPlate');
    const saveBtn = document.getElementById('btnSavePlate');
    if (sellBtn) {
      sellBtn.disabled = false;
      sellBtn.innerHTML = `<span>💰</span> ПРОДАТЬ ЗА +${evaluation.finalPrice.toLocaleString('ru-RU')} ₽`;
    }
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>📥</span> В ГАРАЖ`;
    }
  }

  animateNumber(element, target) {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const current = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      element.textContent = current.toLocaleString('ru-RU');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('ru-RU');
      }
    };
    requestAnimationFrame(update);
  }

  renderCarSelectUI() {
    const sel = document.getElementById('carSelectDropdown');
    if (!sel) return;
    sel.innerHTML = '';
    this.cars.forEach(car => {
      const opt = document.createElement('option');
      opt.value = car.id;
      opt.textContent = `${car.name} ${car.unlocked ? '' : '🔒'}`;
      if (car.id === this.activeCarId) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  applyCustomizerSettings() {
    // Рамка
    const frameEl = document.getElementById('plateFrameBottom');
    if (frameEl) {
      frameEl.innerHTML = `<span class="frame-dot">◆</span> ${this.frameText} <span class="frame-dot">◆</span>`;
    }

    // Болты
    const boltLeft = document.getElementById('boltLeft');
    const boltRight = document.getElementById('boltRight');
    [boltLeft, boltRight].forEach(b => {
      if (!b) return;
      if (this.boltType === 'gold') {
        b.innerHTML = '<img src="gold_eagle_bolt.png" alt="болт" class="bolt-cap-img" />';
      } else if (this.boltType === 'chrome') {
        b.innerHTML = '<div class="bolt-cap-chrome"></div>';
      } else {
        b.innerHTML = '<div class="bolt-cap-black"></div>';
      }
    });

    // Флаг
    const flagBox = document.getElementById('rusFlagBox');
    if (flagBox) {
      flagBox.style.display = this.hasFlag ? 'flex' : 'none';
    }
  }

  disableRollButtons(disabled) {
    document.getElementById('btnRollSingle').disabled = disabled;
    document.getElementById('btnRollMulti').disabled = disabled;
  }

  showToast(message) {
    const existing = document.querySelector('.money-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'money-toast';
    toast.innerHTML = `<span>💬</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  // =============================================================================
  // 9. СОБЫТИЯ И МОДАЛЬНЫЕ ОКНА
  // =============================================================================
  bindEvents() {
    // 3D Parallax Tilt Effect
    const stage = document.getElementById('stageContainer');
    const plateWrapper = document.getElementById('plateWrapper');
    const shine = document.querySelector('.plate-specular-shine');

    if (stage && plateWrapper) {
      stage.addEventListener('mousemove', (e) => {
        if (this.viewMode !== 'stand') return;
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        plateWrapper.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.02)`;
        if (shine) {
          shine.style.transform = `translateX(${x * 120}%) skewX(-20deg)`;
        }
      });

      stage.addEventListener('mouseleave', () => {
        plateWrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        if (shine) {
          shine.style.transform = 'translateX(0) skewX(-20deg)';
        }
      });
    }

    // Кнопки крутки
    document.getElementById('btnRollSingle').addEventListener('click', () => this.rollPlate(2500));
    document.getElementById('btnRollMulti').addEventListener('click', () => this.rollMulti(5));
    document.getElementById('btnAutoRoll').addEventListener('click', () => this.toggleAutoRoll());

    // Переключение режимов: 3D Подиум vs На автомобиле
    document.getElementById('tabViewStand').addEventListener('click', () => {
      this.viewMode = 'stand';
      document.getElementById('tabViewStand').classList.add('active');
      document.getElementById('tabViewCar').classList.remove('active');
      document.getElementById('standViewContainer').style.display = 'block';
      document.getElementById('carViewContainer').style.display = 'none';
    });

    document.getElementById('tabViewCar').addEventListener('click', () => {
      this.viewMode = 'car';
      document.getElementById('tabViewCar').classList.add('active');
      document.getElementById('tabViewStand').classList.remove('active');
      document.getElementById('standViewContainer').style.display = 'none';
      document.getElementById('carViewContainer').style.display = 'block';
      this.updateCarView();
    });

    // Селектор авто
    document.getElementById('carSelectDropdown').addEventListener('change', (e) => {
      const car = this.cars.find(c => c.id === e.target.value);
      if (car) {
        if (!car.unlocked) {
          this.showToast(`Автомобиль ${car.name} еще заблокирован! Откройте его в Гараже.`);
          e.target.value = this.activeCarId;
          return;
        }
        this.selectCar(car.id);
      }
    });

    // Субсидия +100к
    document.getElementById('btnAddBalance').addEventListener('click', () => {
      this.balance += 100000;
      this.updateBalanceUI();
      audio.playCoin();
      this.showToast('💰 Вы получили субсидию +100 000 ₽ от Министерства транспорта!');
      this.saveStorage();
    });

    // Звук вкл/выкл
    const muteBtn = document.getElementById('btnMuteToggle');
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
      this.showToast(audio.muted ? 'Звук отключен' : 'Звук включен');
    });

    // Продажа и Сохранение в карточке
    document.getElementById('btnSellPlate').addEventListener('click', () => this.sellCurrentPlate());
    document.getElementById('btnSavePlate').addEventListener('click', () => this.saveCurrentPlateToGarage());

    // Экспорт сертификата / фото
    document.getElementById('btnExportCard').addEventListener('click', () => this.exportPlateSnapshot());

    // Открытие модалок
    document.getElementById('navGarageBtn').addEventListener('click', () => this.openModal('garageModal', () => this.renderInventoryModal()));
    document.getElementById('navShopBtn').addEventListener('click', () => this.openModal('shopModal', () => this.renderPerksModal()));
    document.getElementById('navCustomBtn').addEventListener('click', () => {
      this.openModal('customizerModal', () => {
        document.getElementById('frameTextInput').value = this.frameText;
        document.getElementById('flagToggleCheckbox').checked = this.hasFlag;
        const targetRadio = document.querySelector(`input[name="boltType"][value="${this.boltType}"]`);
        if (targetRadio) {
          targetRadio.checked = true;
          document.querySelectorAll('.radio-pill-btn').forEach(btn => btn.classList.remove('active'));
          targetRadio.closest('.radio-pill-btn').classList.add('active');
        }
      });
    });
    document.getElementById('navConstructorBtn').addEventListener('click', () => this.openModal('constructorModal'));

    // Закрытие модалок
    document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('modal-close-btn')) {
          this.closeAllModals();
        }
      });
    });

    // Вкладки в гараже (Мои номера / Автосалон)
    document.getElementById('tabGaragePlates').addEventListener('click', () => {
      document.getElementById('tabGaragePlates').classList.add('active');
      document.getElementById('tabGarageCars').classList.remove('active');
      document.getElementById('garagePlatesContent').style.display = 'grid';
      document.getElementById('garageCarsContent').style.display = 'none';
      this.renderInventoryModal();
    });

    document.getElementById('tabGarageCars').addEventListener('click', () => {
      document.getElementById('tabGarageCars').classList.add('active');
      document.getElementById('tabGaragePlates').classList.remove('active');
      document.getElementById('garagePlatesContent').style.display = 'none';
      document.getElementById('garageCarsContent').style.display = 'grid';
      this.renderCarsModal();
    });

    // Радио-кнопки болтов
    document.querySelectorAll('input[name="boltType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('.radio-pill-btn').forEach(btn => btn.classList.remove('active'));
        e.target.closest('.radio-pill-btn').classList.add('active');
      });
    });

    // Автопереход фокуса в конструкторе
    const customInputs = ['customLet1', 'customDigits', 'customLet2', 'customLet3', 'customReg'];
    customInputs.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
        if (e.target.value.length >= e.target.maxLength && idx < customInputs.length - 1) {
          const next = document.getElementById(customInputs[idx + 1]);
          if (next) next.focus();
        }
      });
    });

    // Конструктор своего номера
    document.getElementById('btnEvaluateCustom').addEventListener('click', () => this.evaluateCustomPlate());

    // Кастомизатор рамки
    document.getElementById('frameTextPreset').addEventListener('change', (e) => {
      document.getElementById('frameTextInput').value = e.target.value;
    });

    document.getElementById('btnSaveCustomizer').addEventListener('click', () => {
      this.frameText = document.getElementById('frameTextInput').value.trim() || 'РОССИЯ';
      const boltRadio = document.querySelector('input[name="boltType"]:checked');
      if (boltRadio) this.boltType = boltRadio.value;
      this.hasFlag = document.getElementById('flagToggleCheckbox').checked;

      this.applyCustomizerSettings();
      this.saveStorage();
      this.closeAllModals();
      audio.playMount();
      this.showToast('Параметры госномера сохранены!');
    });
  }

  openModal(modalId, onOpen) {
    this.closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      if (onOpen) onOpen();
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  // Рендер модалки инвентаря
  renderInventoryModal() {
    const container = document.getElementById('garagePlatesContent');
    if (!container) return;
    container.innerHTML = '';

    if (this.inventory.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">📭</div>
          В вашем гараже пока нет сохранённых номеров.<br>Выбивайте красивые номера в рулетке и сохраняйте их сюда!
        </div>
      `;
      return;
    }

    this.inventory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'inventory-card';
      card.innerHTML = `
        <div class="inventory-mini-plate">
          <span>${item.plate.letter1} ${item.plate.digits} ${item.plate.letter2}${item.plate.letter3}</span>
          <span style="font-size: 16px; border-left: 2px solid #000; padding-left: 4px;">${item.plate.regionCode}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; font-weight: bold; color: ${item.plate.tierInfo.color}; text-transform: uppercase;">
            ${item.plate.tierInfo.name}
          </span>
          <span style="font-weight: 800; color: var(--accent-gold); font-size: 14px;">
            ${item.plate.finalPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <div style="font-size: 11px; color: var(--text-muted);">${item.plate.regionName} • ${item.date}</div>
        <div style="display: flex; gap: 6px; margin-top: 4px;">
          <button class="nav-btn" style="flex: 1; padding: 6px;" onclick="game.equipInventoryPlate(${item.id})">Надеть</button>
          <button class="nav-btn" style="flex: 1; padding: 6px; color: var(--accent-red);" onclick="game.sellInventoryPlate(${item.id})">Продать</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Рендер автосалона
  renderCarsModal() {
    const container = document.getElementById('garageCarsContent');
    if (!container) return;
    container.innerHTML = '';

    this.cars.forEach(car => {
      const card = document.createElement('div');
      card.className = 'inventory-card';
      const isCurrent = car.id === this.activeCarId;

      card.innerHTML = `
        <div style="height: 130px; border-radius: 8px; overflow: hidden; background: #000; position: relative;">
          <img src="${car.img}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          ${car.unlocked ? '<div style="position: absolute; top: 6px; right: 6px; background: rgba(46, 204, 113, 0.9); font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; color: #fff;">КУПЛЕНО</div>' : ''}
        </div>
        <div style="font-weight: 800; font-size: 15px; color: #fff;">${car.name}</div>
        <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.3;">${car.desc}</div>
        <div style="margin-top: auto; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 800; color: var(--accent-gold);">
            ${car.unlocked ? 'В гараже' : `${car.price.toLocaleString('ru-RU')} ₽`}
          </span>
          ${
            car.unlocked
              ? `<button class="nav-btn ${isCurrent ? 'active' : ''}" style="padding: 6px 14px;" onclick="game.selectCar('${car.id}'); game.closeAllModals();">
                  ${isCurrent ? 'Выбрано' : 'Выбрать'}
                 </button>`
              : `<button class="btn-sell-now" style="padding: 6px 14px; font-size: 13px;" onclick="game.buyCar('${car.id}')">Купить</button>`
          }
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Рендер улучшений в магазине
  renderPerksModal() {
    const perksConfig = [
      {
        key: 'major',
        title: '👮‍♂️ Знакомый майор в МРЭО',
        desc: '+15% шанс выпадения «зеркалок» (101, 707) и круглых соток (100, 200...)',
        cost: 75000,
        level: this.perks.major
      },
      {
        key: 'specialSeries',
        title: '🗄️ Спецсерия из сейфа начальника',
        desc: '+10% шанс одинаковых трех букв (ААА, ООО, МММ, ВОР)',
        cost: 350000,
        level: this.perks.specialSeries
      },
      {
        key: 'kremlinCall',
        title: '👑 Прямой звонок из Кремля',
        desc: 'Открывает правительственные серии А-МР и Е-КХ в пуле выпадения',
        cost: 1500000,
        level: this.perks.kremlinCall
      },
      {
        key: 'moscowProp',
        title: '🏙️ Московская прописка',
        desc: 'Столичные элитные коды (77, 99, 777, 799) выпадают в 3 раза чаще',
        cost: 500000,
        level: this.perks.moscowProp
      }
    ];

    const container = document.getElementById('perksListContainer');
    if (!container) return;
    container.innerHTML = '';

    perksConfig.forEach(p => {
      const item = document.createElement('div');
      item.className = 'perk-item';
      item.innerHTML = `
        <div class="perk-info">
          <div>
            <div class="perk-title">${p.title}</div>
            <div class="perk-desc">${p.desc}</div>
            <div class="perk-level-tag">Уровень связи: ${p.level} / 5</div>
          </div>
        </div>
        <button class="perk-buy-btn" ${this.balance < p.cost || p.level >= 5 ? 'disabled' : ''} onclick="game.buyPerk('${p.key}')">
          ${p.level >= 5 ? 'МАКС. УРОВЕНЬ' : `Улучшить (${p.cost.toLocaleString('ru-RU')} ₽)`}
        </button>
      `;
      container.appendChild(item);
    });
  }

  // Оценка введенного кастомного номера
  evaluateCustomPlate() {
    const l1 = (document.getElementById('customLet1').value || 'А').toUpperCase();
    const d = (document.getElementById('customDigits').value || '777').padStart(3, '0');
    const l2 = (document.getElementById('customLet2').value || 'А').toUpperCase();
    const l3 = (document.getElementById('customLet3').value || 'А').toUpperCase();
    const reg = (document.getElementById('customReg').value || '77').trim();

    const evaluation = ValuationEngine.evaluate(l1, d, l2, l3, reg);
    this.currentPlate = { letter1: l1, digits: d, letter2: l2, letter3: l3, regionCode: reg };
    this.currentEvaluation = evaluation;

    this.renderPlateUI();
    this.renderAppraisal(evaluation);
    audio.playWin(evaluation.tier);
    this.closeAllModals();
    this.showToast(`🔍 Экспертиза проведена! Стоимость номера: ${evaluation.finalPrice.toLocaleString('ru-RU')} ₽`);
  }

  // Экспорт карточки госномера в PNG через Canvas
  exportPlateSnapshot() {
    if (!this.currentEvaluation) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Фон
    ctx.fillStyle = '#0d1017';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Заголовок
    ctx.fillStyle = '#f5b041';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ГОСНОМЕРА 3D • ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ', 60, 70);

    ctx.fillStyle = '#8b9bb4';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Категория: ${this.currentEvaluation.tierInfo.name.toUpperCase()} | Оценочная стоимость: ${this.currentEvaluation.finalPrice.toLocaleString('ru-RU')} ₽`, 60, 110);

    // Рамка номера
    const px = 100, py = 160, pw = 1000, ph = 240;
    ctx.fillStyle = '#111215';
    ctx.beginPath();
    ctx.roundRect(px - 15, py - 15, pw + 30, ph + 45, 16);
    ctx.fill();

    // Пластина
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 10);
    ctx.fill();

    // Черный контур
    ctx.strokeStyle = '#141416';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(px + 8, py + 8, pw - 16, ph - 16, 8);
    ctx.stroke();

    // Разделитель
    const divX = px + pw - 240;
    ctx.beginPath();
    ctx.moveTo(divX, py + 8);
    ctx.lineTo(divX, py + ph - 8);
    ctx.stroke();

    // Текст госномера
    ctx.fillStyle = '#121316';
    ctx.font = 'bold 150px GOST-Plate, Arial, sans-serif';
    ctx.fillText(this.currentPlate.letter1, px + 50, py + 165);
    ctx.font = 'bold 190px GOST-Plate, Arial, sans-serif';
    ctx.fillText(this.currentPlate.digits, px + 180, py + 180);
    ctx.font = 'bold 150px GOST-Plate, Arial, sans-serif';
    ctx.fillText(`${this.currentPlate.letter2}${this.currentPlate.letter3}`, px + 570, py + 165);

    // Регион
    ctx.font = 'bold 130px GOST-Plate, Arial, sans-serif';
    ctx.fillText(this.currentPlate.regionCode, divX + 35, py + 130);

    // RUS + Флаг
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('RUS', divX + 40, py + 205);

    // Флаг РФ
    const fx = divX + 130, fy = py + 175, fw = 50, fh = 32;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx, fy, fw, fh / 3);
    ctx.fillStyle = '#0039a6';
    ctx.fillRect(fx, fy + fh / 3, fw, fh / 3);
    ctx.fillStyle = '#d52b1e';
    ctx.fillRect(fx, fy + (fh / 3) * 2, fw, fh / 3);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(fx, fy, fw, fh);

    // Рамка текст
    ctx.fillStyle = '#adb5bd';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.frameText, px + pw / 2, py + ph + 20);
    ctx.textAlign = 'left';

    // Описание внизу
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Значение: ${this.currentEvaluation.lettersTitle} • ${this.currentEvaluation.digitsTitle}`, 60, 480);
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(this.currentEvaluation.lore.substring(0, 110) + '...', 60, 520);

    // Скачивание
    const link = document.createElement('a');
    link.download = `gosnomer_${this.currentPlate.letter1}${this.currentPlate.digits}${this.currentPlate.letter2}${this.currentPlate.letter3}_${this.currentPlate.regionCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showToast('📸 Фотография и сертификат номера успешно сохранены!');
  }
}

// Запуск игры
let game;
window.addEventListener('DOMContentLoaded', () => {
  game = new NomeraGame();
  window.game = game;
});
