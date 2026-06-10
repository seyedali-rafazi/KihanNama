import { SATELLITES } from './satellites'
import type { SatelliteCatalogEntry } from '../types/satellite'

function orbitClass(altitude: number): SatelliteCatalogEntry['orbitClass'] {
  if (altitude >= 35_000_000) return 'geo'
  if (altitude >= 2_000_000) return 'meo'
  return 'leo'
}

const catalogMeta: Record<string, Omit<SatelliteCatalogEntry, keyof typeof SATELLITES[0]>> = {
  iss: {
    category: 'station',
    orbitClass: 'leo',
    operatorEn: 'NASA / Roscosmos / ESA',
    operatorFa: 'ناسا / روسکosmos / آژانس فضایی اروپا',
    launchYear: 1998,
    descriptionEn: 'The largest modular space station in low Earth orbit, serving as a microgravity laboratory for science and international cooperation.',
    descriptionFa: 'بزرگ‌ترین ایستگاه فضایی مدولار در مدار پایین زمین برای پژوهش در شرایط بی‌وزنی و همکاری بین‌المللی.',
    abilitiesEn: ['Crew habitation', 'Microgravity research', 'Earth observation', 'Technology demonstration'],
    abilitiesFa: ['زندگی فضانوردان', 'پژوهش بی‌وزنی', 'رصد زمین', 'آزمایش فناوری'],
    orbitSteps: 42,
    infographicLeft: [
      { titleEn: 'Mission Role', titleFa: 'نقش مأموریت', descriptionEn: 'Permanent human outpost and orbital laboratory.', descriptionFa: 'پایگاه دائمی انسان و آزمایشگاه مداری.' },
      { titleEn: 'Orbit Type', titleFa: 'نوع مدار', descriptionEn: 'Low Earth orbit with 51.6° inclination.', descriptionFa: 'مدار پایین زمین با شیب ۵۱.۶ درجه.' },
      { titleEn: 'Altitude', titleFa: 'ارتفاع', descriptionEn: 'Flies near 420 km above Earth surface.', descriptionFa: 'در ارتفاع حدود ۴۲۰ کیلومتری زمین.' },
      { titleEn: 'Orbital Period', titleFa: 'دوره مداری', descriptionEn: 'Completes one revolution in ~92 minutes.', descriptionFa: 'هر مدار تقریباً ۹۲ دقیقه طول می‌کشد.' },
    ],
    infographicRight: [
      { titleEn: 'Crew Capacity', titleFa: 'ظرفیت خدمه', descriptionEn: 'Supports long-duration crews of up to 7 astronauts.', descriptionFa: 'پشتیبانی از خدمه تا ۷ فضانورد.' },
      { titleEn: 'Power System', titleFa: 'سیستم توان', descriptionEn: 'Large solar arrays generate station power.', descriptionFa: 'آرایه‌های خورشیدی بزرگ انرژی تأمین می‌کنند.' },
      { titleEn: 'Data Relay', titleFa: 'بازپخش داده', descriptionEn: 'Continuous communications with ground networks.', descriptionFa: 'ارتباط مداوم با شبکه‌های زمینی.' },
      { titleEn: 'Launch Steps', titleFa: 'مراحل پرتاب', descriptionEn: 'Assembled over 42 major orbital assembly missions.', descriptionFa: 'در ۴۲ مأموریت مونتاژ مداری ساخته شد.' },
    ],
  },
  hubble: {
    category: 'science',
    orbitClass: 'leo',
    operatorEn: 'NASA / ESA',
    operatorFa: 'ناسا / آژانس فضایی اروپا',
    launchYear: 1990,
    descriptionEn: 'Space telescope delivering deep-space and high-resolution astronomical imagery from above Earth atmosphere.',
    descriptionFa: 'تلسکوپ فضایی برای تصویربرداری با وضوح بالا از فراتر از جو زمین.',
    abilitiesEn: ['Deep-space imaging', 'Ultraviolet astronomy', 'Cosmic distance measurement', 'Servicing missions'],
    abilitiesFa: ['تصویربرداری فضای عمیق', 'اخترشناسی فرابنفش', 'اندازه‌گیری فاصله کیهانی', 'مأموریت‌های سرویس'],
    orbitSteps: 5,
    infographicLeft: [
      { titleEn: 'Primary Mirror', titleFa: 'آینه اصلی', descriptionEn: '2.4 m mirror captures faint cosmic light.', descriptionFa: 'آینه ۲.۴ متری نور کیهانی ضعیف را جمع می‌کند.' },
      { titleEn: 'Observation Band', titleFa: 'باند مشاهده', descriptionEn: 'Visible, near-infrared, and ultraviolet spectra.', descriptionFa: 'طیف‌های مرئی، نزدیک فروسرخ و فرابنفش.' },
      { titleEn: 'Orbit Stability', titleFa: 'پایداری مدار', descriptionEn: 'Stable LEO enables long exposure science.', descriptionFa: 'مدار پایدار LEO برای نوردهی طولانی.' },
      { titleEn: 'Servicing History', titleFa: 'سابقه سرویس', descriptionEn: 'Upgraded through five astronaut servicing flights.', descriptionFa: 'در پنج پرواز سرویس فضانوردی ارتقا یافت.' },
    ],
    infographicRight: [
      { titleEn: 'Science Output', titleFa: 'خروجی علمی', descriptionEn: 'Enabled major discoveries in cosmology.', descriptionFa: 'کشفیات بزرگ در کیهان‌شناسی ممکن شد.' },
      { titleEn: 'Pointing Accuracy', titleFa: 'دقت نشانه‌روی', descriptionEn: 'Tracks celestial targets with high precision.', descriptionFa: 'هدف‌های آسمانی را با دقت بالا دنبال می‌کند.' },
      { titleEn: 'Data Archive', titleFa: 'آرشیو داده', descriptionEn: 'Open science archive used worldwide.', descriptionFa: 'آرشیو علمی باز در سراسر جهان.' },
      { titleEn: 'Launch Steps', titleFa: 'مراحل پرتاب', descriptionEn: 'Deployed in one launch, upgraded in five steps.', descriptionFa: 'یک پرتاب و پنج مرحله ارتقا در مدار.' },
    ],
  },
}

function defaultMeta(sat: typeof SATELLITES[0]): Omit<SatelliteCatalogEntry, keyof typeof SATELLITES[0]> {
  const oc = orbitClass(sat.altitude)
  const category: SatelliteCatalogEntry['category'] =
    sat.id === 'iss' ? 'station'
    : sat.id.startsWith('gps') || sat.id.startsWith('galileo') ? 'navigation'
    : sat.id.startsWith('goes') || sat.id.includes('noaa') || sat.id.includes('metop') || sat.id.includes('suomi') ? 'weather'
    : sat.id.startsWith('starlink') || sat.id.startsWith('iridium') ? 'communications'
    : 'earthObservation'

  const categoryLabel = {
    earthObservation: { en: 'Earth observation', fa: 'رصد زمین' },
    navigation: { en: 'Navigation', fa: 'ناوبری' },
    weather: { en: 'Weather monitoring', fa: 'پایش آب‌وهوا' },
    communications: { en: 'Communications', fa: 'ارتباطات' },
    science: { en: 'Space science', fa: 'علوم فضایی' },
    station: { en: 'Space station', fa: 'ایستگاه فضایی' },
  }[category]

  const orbitLabel = {
    leo: { en: 'Low Earth Orbit (LEO)', fa: 'مدار پایین زمین (LEO)' },
    meo: { en: 'Medium Earth Orbit (MEO)', fa: 'مدار میانی زمین (MEO)' },
    geo: { en: 'Geostationary Orbit (GEO)', fa: 'مدار زمین‌ثابت (GEO)' },
  }[oc]

  const altKm = Math.round(sat.altitude / 1000)
  const periodMin = Math.round(sat.period / 60)

  return {
    category,
    orbitClass: oc,
    operatorEn: 'International space agency',
    operatorFa: 'آژانس فضایی بین‌المللی',
    launchYear: 2010,
    descriptionEn: `${sat.name} operates in ${orbitLabel.en} for ${categoryLabel.en.toLowerCase()} missions and continuous Earth coverage.`,
    descriptionFa: `${sat.name} در ${orbitLabel.fa} برای مأموریت‌های ${categoryLabel.fa} فعالیت می‌کند.`,
    abilitiesEn: [categoryLabel.en, 'Orbital telemetry', 'Global coverage', 'Real-time data downlink'],
    abilitiesFa: [categoryLabel.fa, 'تلهمتری مداری', 'پوشش جهانی', 'دریافت داده بلادرنگ'],
    orbitSteps: oc === 'geo' ? 3 : oc === 'meo' ? 2 : 1,
    infographicLeft: [
      { titleEn: 'Mission Role', titleFa: 'نقش مأموریت', descriptionEn: `${categoryLabel.en} platform for environmental monitoring.`, descriptionFa: `بستر ${categoryLabel.fa} برای پایش محیطی.` },
      { titleEn: 'Orbit Type', titleFa: 'نوع مدار', descriptionEn: orbitLabel.en, descriptionFa: orbitLabel.fa },
      { titleEn: 'Altitude', titleFa: 'ارتفاع', descriptionEn: `Operates near ${altKm.toLocaleString()} km altitude.`, descriptionFa: `در ارتفاع حدود ${altKm.toLocaleString()} کیلومتر.` },
      { titleEn: 'Inclination', titleFa: 'شیب مدار', descriptionEn: `Orbital inclination of ${sat.inclination}°.`, descriptionFa: `شیب مداری ${sat.inclination} درجه.` },
    ],
    infographicRight: [
      { titleEn: 'Orbital Period', titleFa: 'دوره مداری', descriptionEn: `One orbit every ~${periodMin} minutes.`, descriptionFa: `هر مدار حدود ${periodMin} دقیقه.` },
      { titleEn: 'Sensor Capability', titleFa: 'توان سنجش', descriptionEn: 'Multi-spectral Earth sensing instruments onboard.', descriptionFa: 'ابزارهای سنجش چندطیفی زمین.' },
      { titleEn: 'Ground Link', titleFa: 'لینک زمینی', descriptionEn: 'Connected to global ground station networks.', descriptionFa: 'متصل به شبکه ایستگاه‌های زمینی.' },
      {
        titleEn: 'Launch Steps',
        titleFa: 'مراحل پرتاب',
        descriptionEn: `${oc === 'geo' ? 3 : oc === 'meo' ? 2 : 1} orbital insertion and commissioning phases.`,
        descriptionFa: `${oc === 'geo' ? '۳' : oc === 'meo' ? '۲' : '۱'} مرحله قرارگیری و راه‌اندازی مداری.`,
      },
    ],
  }
}

export const SATELLITE_CATALOG: SatelliteCatalogEntry[] = SATELLITES.map((sat) => ({
  ...sat,
  ...(catalogMeta[sat.id] ?? defaultMeta(sat)),
}))

// Enrich a few more with specific data
const enrichments: Partial<Record<string, Partial<Omit<SatelliteCatalogEntry, keyof typeof SATELLITES[0]>>>> = {
  terra: {
    operatorEn: 'NASA',
    operatorFa: 'ناسا',
    launchYear: 1999,
    descriptionEn: 'Flagship Earth observing system monitoring land, oceans, and atmosphere.',
    descriptionFa: 'سامانه شاخص رصد زمین برای پایش خشکی، اقیانوس و جو.',
  },
  'gps-iii-1': {
    operatorEn: 'US Space Force',
    operatorFa: 'نیروی فضایی آمریکا',
    launchYear: 2018,
    category: 'navigation',
    descriptionEn: 'Next-generation GPS satellite providing precision global positioning.',
    descriptionFa: 'ماهواره نسل جدید GPS برای موقعیت‌یابی دقیق جهانی.',
    orbitSteps: 2,
  },
  goes16: {
    operatorEn: 'NOAA / NASA',
    operatorFa: 'NOAA / ناسا',
    launchYear: 2016,
    category: 'weather',
    descriptionEn: 'Advanced geostationary weather satellite for hurricane and storm tracking.',
    descriptionFa: 'ماهواره پیشرفته آب‌وهوایی زمین‌ثابت برای ردیابی طوفان.',
    orbitSteps: 3,
  },
  'starlink-1': {
    operatorEn: 'SpaceX',
    operatorFa: 'اسپیس‌ایکس',
    launchYear: 2019,
    category: 'communications',
    descriptionEn: 'Broadband internet constellation satellite in low Earth orbit.',
    descriptionFa: 'ماهواره صورت فلکی اینترنت پرسرعت در مدار پایین.',
    orbitSteps: 1,
  },
}

SATELLITE_CATALOG.forEach((entry) => {
  const extra = enrichments[entry.id]
  if (extra) Object.assign(entry, extra)
})
