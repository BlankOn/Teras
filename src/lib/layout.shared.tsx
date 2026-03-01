import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { i18n } from '@/lib/i18n'

function Logo() {
  return (
    <>
      <img
        src="/logo-black.png"
        alt="BlankOn"
        className="block h-6 w-auto dark:hidden"
      />
      <img
        src="/logo-white.png"
        alt="BlankOn"
        className="hidden h-4 w-auto dark:block"
      />
    </>
  )
}

const translations = {
  id: {
    home: 'Beranda',
    download: 'Unduh',
    wiki: 'Wiki',
    welcome: 'Selamat datang di BlankOn',
    downloadDesc: 'Halaman unduh BlankOn',
    feedback: {
      question: 'Bagaimana panduan ini?',
      good: 'Bagus',
      bad: 'Kurang',
      placeholder: 'Tulis masukan Anda...',
      submit: 'Kirim',
      thanks: 'Terima kasih atas masukan Anda!',
      viewOnGithub: 'Lihat di GitHub',
      submitAgain: 'Kirim Lagi',
    },
    homepage: {
      heroTitle: 'BlankOn Revival Project',
      heroTagline:
        'An attempt to bring back the long-dormant BlankOn project from the depths of /dev/null',
      downloadIso: 'Unduh ISO',
      readDocs: 'Dokumentasi',
      aboutTitle: 'Tentang',
      aboutDescription:
        'BlankOn adalah distribusi Linux Indonesia berbasis Debian. Setelah bertahun-tahun tidak aktif, tim baru telah membangun ulang infrastruktur dan merilis ISO pertama yang dapat di-boot dari sistem build IRGSH kami sendiri. Unduh, jalankan, dan kembangkan.',
      sponsorsTitle: 'Sponsor',
      faqTitle: 'Pertanyaan Umum',
      faq: {
        q1: 'Apa itu BlankOn Revival Project?',
        a1: 'Upaya untuk membangkitkan kembali proyek BlankOn yang telah lama tidak aktif dari kedalaman /dev/null.',
        q2: 'Bagaimana cara berkontribusi?',
        a2: 'Kami berkolaborasi di grup Telegram publik di mana siapa saja dapat melihat dan bergabung. Kami juga menerima donasi dalam bentuk hardware, bandwidth, atau dana tunai.',
        q3: 'Bagaimana cara mendaftar sebagai kontributor?',
        a3: 'Kirim CV Anda ke herpiko@gmail.com dan kami akan menjadwalkan sesi wawancara.',
        q4: 'Apa ukuran keberhasilan kebangkitan ini?',
        a4: 'Anda dapat mengunduh dan menginstal image Linux BlankOn baru yang lengkap, dibangun dan dikirim langsung dari IRGSH. Jika Anda dapat mem-boot, menjalankan, dan mengembangkannya, itulah milestone kebangkitan kami.',
      },
      getInvolvedTitle: 'Bergabunglah',
      getInvolvedDescription:
        'Bergabunglah dengan grup Telegram kami untuk mengikuti perkembangan dan berkontribusi.',
      joinTelegram: 'Gabung Telegram',
    },
  },
  en: {
    home: 'Home',
    download: 'Download',
    wiki: 'Wiki',
    welcome: 'Welcome to BlankOn',
    downloadDesc: 'BlankOn download page',
    feedback: {
      question: 'How is this guide?',
      good: 'Good',
      bad: 'Bad',
      placeholder: 'Leave your feedback...',
      submit: 'Submit',
      thanks: 'Thank you for your feedback!',
      viewOnGithub: 'View on GitHub',
      submitAgain: 'Submit Again',
    },
    homepage: {
      heroTitle: 'BlankOn Revival Project',
      heroTagline:
        'An attempt to bring back the long-dormant BlankOn project from the depths of /dev/null',
      downloadIso: 'Download ISO',
      readDocs: 'Documentation',
      aboutTitle: 'About',
      aboutDescription:
        'BlankOn is an Indonesian Linux distribution based on Debian. After years of dormancy, a new team has rebuilt the infrastructure and shipped the first bootable ISO from our own IRGSH build system. Download it, boot it, hack on it.',
      sponsorsTitle: 'Sponsors',
      faqTitle: 'FAQ',
      faq: {
        q1: 'What is BlankOn Revival Project?',
        a1: 'An attempt to bring back the long-dormant BlankOn project from the depths of /dev/null.',
        q2: 'How can I contribute?',
        a2: 'We collaborate in a public Telegram group where anyone can watch and join. We also accept donations in hardware, bandwidth, or cold hard cash.',
        q3: 'How to apply as a contributor?',
        a3: 'Send your CV to herpiko@gmail.com and we will schedule an interview session.',
        q4: 'What is the success metric of the revival?',
        a4: 'You can download and install a fully-fledged, brand-new BlankOn Linux image, built and shipped directly from IRGSH. If you can boot it, run it, and hack on it, that is our revival milestone.',
      },
      getInvolvedTitle: 'Get Involved',
      getInvolvedDescription:
        'Join our Telegram group to follow the progress and contribute.',
      joinTelegram: 'Join Telegram',
    },
  },
}

export function getTranslations(locale: string) {
  if (locale in translations) {
    return translations[locale as keyof typeof translations]
  }
  return translations.id
}

export function baseOptions(locale: string): BaseLayoutProps {
  const t = getTranslations(locale)

  return {
    i18n,
    nav: {
      title: <Logo />,
      url: `/${locale}`,
    },
    links: [
      {
        text: t.home,
        url: `/${locale}`,
        active: 'url',
      },
      {
        text: t.download,
        url: `/${locale}/download`,
        active: 'nested-url',
      },
      {
        text: t.wiki,
        url: `/${locale}/wiki`,
        active: 'nested-url',
      },
    ],
  }
}
