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
    team: 'Tim',
    sponsorship: 'Sponsorship',
    donate: 'Donasi',
    welcome: 'Selamat datang di BlankOn',
    downloadDesc: 'Halaman unduh BlankOn',
    downloadPage: {
      title: 'Unduh BlankOn',
      subtitle: 'Unduh image live BlankOn terbaru untuk arsitektur amd64.',
      dailyBuildWarning: 'Ini adalah jahitan harian (daily build). Mungkin mengandung bug, fitur yang belum stabil, atau bahkan tidak dapat di-boot sama sekali.',
      downloadButton: 'Unduh ISO',
      fileDetails: 'Detail Berkas',
      filename: 'Nama Berkas',
      architecture: 'Arsitektur',
      type: 'Tipe Berkas',
      typeValue: 'Live Image (Hybrid ISO)',
      releaseType: 'Rilis',
      releaseTypeValue: 'Jahitan Harian',
      checksum: 'SHA256',
      checksumLoading: 'Memuat...',
      checksumError: 'Gagal memuat',
      checksumNote: 'Selalu verifikasi checksum setelah mengunduh.',
      moreInfo: 'Informasi lebih lanjut',
      wikiLink: 'Baca Wiki',
    },
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
      heroTagline: [
        'Sebuah usaha untuk membangkitkan kembali proyek BlankOn',
        'yang sudah lama mati suri dari kedalaman /dev/null',
      ],
      downloadIso: 'Unduh ISO',
      readDocs: 'Dokumentasi',
      aboutTitle: 'Tentang',
      aboutDescription:
        'BlankOn adalah distribusi Linux Indonesia berbasis Debian yang telah menjadi gerakan open-source sejak 2004. Setelah bertahun-tahun tidak aktif, tim baru telah membangun ulang infrastruktur dan merilis ISO pertama yang dapat di-boot dari sistem build IRGSH kami sendiri. Mari unduh, jalankan, dan kembangkan bersama-sama.',
      teamTitle: 'Tim',
      sponsorsTitle: 'Sponsor',
      faqTitle: 'Tanya Ini Lagi Itu Lagi (TILIL)',
      faq: {
        q1: 'Apa itu BlankOn Revival Project?',
        a1: 'Sebuah usaha untuk membangkitkan kembali proyek BlankOn yang sudah lama mati suri dari kedalaman /dev/null.',
        q2: 'Bagaimana cara berkontribusi?',
        a2: 'Hingga kebangkitan selesai, kami akan beroperasi hanya dengan kontributor teknis. Kami membuka posisi untuk kontributor inti, namun proses seleksinya akan ketat karena beberapa alasan. Kami berkolaborasi di grup Telegram publik di mana siapa saja bisa melihat dan bergabung dengan pergerakan lalu biarkan kontribusi terjadi secara alami. Kami juga sangat membutuhkan donasi dalam bentuk hardware, bandwidth (server colocation), atau uang tunai. Kami memiliki laporan transparan di sini untuk menunjukkan ke mana setiap rupiah pergi. Hubungi @senyumslamet jika Anda ingin berdonasi.',
        q3: 'Apa kriteria untuk menjadi kontributor inti proyek kebangkitan ini?',
        a3: 'Untuk menjadi salah satu dari kami, Anda perlu membuktikan seberapa geeky Anda sebenarnya dan kemauan untuk mengotori tangan Anda dengan terminal emulator. Gen-Z lebih diutamakan, meskipun kami tidak memiliki batasan ketat untuk itu. Bawa semangat, buktikan Anda salah satu dari kami, maka Anda masuk.',
        q4: 'Bagaimana cara mendaftar?',
        a4: 'Silakan kirim CV Anda ke herpiko@gmail.com dan kami akan mempersiapkan sesi wawancara untuk Anda.',
        q5: 'Saya mantan kontributor BlankOn, apakah saya bisa bergabung?',
        a5: 'Silakan kirim CV Anda ke herpiko@gmail.com dan kami akan mempersiapkan sesi wawancara untuk Anda.',
        q6: 'Apakah ini tempat untuk belajar dari nol?',
        a6: 'Belum. Tentu tidak sekarang. Pada tahap ini, kami membutuhkan orang-orang yang sudah memiliki kemampuan Linux tingkat menengah dan rasa ingin tahu yang berlebihan untuk membantu membuat kebangkitan ini berhasil. Mentor tidak akan memberi makan Anda dari nol. Anda seharusnya sudah nyaman hidup di dalam terminal dan sesekali berdebat dengannya.',
        q7: 'Apa yang bisa saya harapkan dari proyek ini? Apa yang baru di BlankOn?',
        a7: 'Setelah kebangkitan, BlankOn akan memperkuat tujuan awalnya untuk meningkatkan kapasitas manusia dengan membuka lebih banyak peran non-teknis. BlankOn juga akan menurunkan hambatan kontribusi sambil menerapkan Kode Etik yang lebih ketat, bertujuan untuk memastikan inklusivitas dan menjaga komunitas tetap sehat dan ramah kontributor. Proyek ini juga akan bekerja untuk mempertahankan rasio optimal antara kontributor teknis dan non-teknis untuk membuat produk teknis (dalam hal ini, distribusi Linux) berkelanjutan dan sehat.',
        q8: 'Apa tolok ukur keberhasilan kebangkitan ini?',
        a8: 'Anda dapat mengunduh dan menginstal image Linux BlankOn baru yang lengkap, dibangun dan dikirim langsung dari IRGSH. Jika Anda dapat mem-boot, menjalankan, dan mengembangkannya, itulah milestone kebangkitan kami.',
        q9: 'Apa kemajuan saat ini?',
        a9: 'Silakan lihat bagian Perkembangan di bawah ini.',
        q10: 'Kapan versi stabil akan dirilis?',
        a10: 'Sebelum akhir tahun 2026. Mungkin lebih cepat jika Anda membantu kami dengan berkontribusi.',
      },
      updatesTitle: 'Perkembangan',
      updates: [
        {
          date: '2026-02-07',
          text: 'Yayasan BlankOn telah resmi berdiri secara hukum. Dewan pengurus terdiri dari Rusmanto, Akhmat Safrudin, Slamet Santoso, Iwan Setiawan, dan Herpiko Dwi Aguno. Yayasan BlankOn adalah badan hukum terpisah yang dibentuk untuk mendukung ekosistem open-source yang lebih luas, komunitas, dan proyek-proyek di Indonesia. Sementara itu, BlankOn Linux akan tetap berjalan sebagai proyek open-source yang independen, dengan Yayasan memberikan dukungan finansial dan hukum penuh.',
          url: 'https://blankon.id/en/team',
        },
        {
          date: '2026-01-25',
          text: 'Saputro Aryulianto meminjamkan kami sebuah mesin arm64 yang bertenaga untuk mengeksplorasi potensi distribusi BlankOn pada arsitektur ARM. Kami sudah mulai menyinkronkan port arm64 dari upstream.',
          url: 'http://arsip-dev.blankonlinux.id/dev/dists/verbeek/Contents-arm64',
        },
        {
          date: '2026-01-22',
          text: 'Praya, penerus Manokwari Desktop, lahir. Kode sumbernya dapat ditemukan di GitHub atau diuji melalui live ISO kami.',
          url: 'https://github.com/BlankOn/praya-gnome-shell-extension',
        },
        {
          date: '2026-01-07',
          text: 'IRGSH sudah berfungsi penuh secara end-to-end di infrastruktur cloud BlankOn, siap untuk mempaket dan mengirimkan apa saja.',
          url: 'http://irgsh.blankonlinux.id/submissions/',
        },
        {
          date: '2026-01-01',
          text: 'Kami berhasil membangun image ISO yang dapat di-boot untuk pertama kali sejak kebangkitan. Dibangun berdasarkan repositori kami sendiri yang disinkronkan dengan repositori Debian Sid.',
          url: 'http://jahitan.blankonlinux.id/',
        },
        {
          date: '2025-12-10',
          text: 'Saputro Aryulianto, mantan kontributor BlankOn, telah menyimpan domain blankonlinux.id selama bertahun-tahun sebagai tindakan pencegahan. Karena blankonlinux.or.id telah diambil orang lain, ia mendonasikan domain .id ini kepada kami. Terima kasih!',
        },
        {
          date: '2025-12-08',
          text: 'Dengan bantuan Estu Fardani, kami mendapatkan akses ke rafi.blankon.id. Kami juga berkoordinasi dengan Pak Dhanank, yang mensponsori kami atas nama HostBadak, untuk memperpanjang sponsorship Rafi, termasuk colocation dan bandwidth-nya.',
        },
        {
          date: '2025-12-07',
          text: 'Kami mengadakan rapat mingguan pertama bersama kontributor inti.',
        },
        {
          date: '2025-11-30',
          text: 'Kami baru saja menyelesaikan rapat kickoff pertama BlankOn Revival Project! Semua orang akhirnya bisa bertemu dan mulai membicarakan rencana kebangkitan.',
        },
        {
          date: '2025-11-28',
          text: 'STT-NF menjadi sponsor pertama kami dalam proyek kebangkitan ini, dengan menampung Lenovo M920x (8 core / 64GB RAM / 1TB SSD / 4x Gigabit LAN) di kampus mereka sebagai host baru untuk IRGSH.',
        },
        {
          date: '2025-11-24',
          text: 'Posisi kontributor inti kini dibuka, menargetkan para penggemar muda dan geeky.',
        },
        {
          date: '2025-07-25',
          text: 'Saat istirahat di OpenInfra Days 2025, @stwn dan @herpiko bertemu dan mendiskusikan kemungkinan menghidupkan kembali proyek ini. Anggota dewan baru terbentuk, termasuk manajer rilis saat ini @senyumslamet dan mantan kontributor BlankOn @somat.',
        },
        {
          date: '2025-04-08',
          text: 'Utian Ayuba membuka diskusi berjudul "Mau Dibawa Ke Mana BlankOn Linux?" di grup Telegram BlankOn.',
        },
      ],
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
    team: 'Team',
    sponsorship: 'Sponsorship',
    donate: 'Donate',
    welcome: 'Welcome to BlankOn',
    downloadDesc: 'BlankOn download page',
    downloadPage: {
      title: 'Download BlankOn',
      subtitle: 'Get the latest BlankOn live image for amd64 architecture.',
      dailyBuildWarning: 'This is a daily stitch (daily build). It may contain bugs, unstable features, or may not even boot at all.',
      downloadButton: 'Download ISO',
      fileDetails: 'File Details',
      filename: 'Filename',
      architecture: 'Architecture',
      type: 'File Type',
      typeValue: 'Live Image (Hybrid ISO)',
      releaseType: 'Release',
      releaseTypeValue: 'Daily Stitch',
      checksum: 'SHA256',
      checksumLoading: 'Loading...',
      checksumError: 'Failed to load',
      checksumNote: 'Always verify the checksum after downloading.',
      moreInfo: 'More Information',
      wikiLink: 'Read the Wiki',
    },
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
      heroTagline: [
        'An attempt to bring back the long-dormant BlankOn project',
        'from the depths of /dev/null',
      ],
      downloadIso: 'Download ISO',
      readDocs: 'Documentation',
      aboutTitle: 'About',
      aboutDescription:
        'BlankOn is an Indonesian Linux distribution based on Debian and an open-source movement since 2004. After years of dormancy, a new team has rebuilt the infrastructure and shipped the first bootable ISO from our own IRGSH build system. Download it, boot it, hack on it.',
      teamTitle: 'Team',
      sponsorsTitle: 'Sponsors',
      faqTitle: 'FAQ',
      faq: {
        q1: 'What is BlankOn Revival Project?',
        a1: 'An attempt to bring back the long-dormant BlankOn project from the depths of /dev/null.',
        q2: 'How can I contribute?',
        a2: 'Until the revival is complete, we will be operating with technical contributors only. We are opening positions for core contributors, but the selection process will be strict for several reasons. We collaborate in a public Telegram group where anyone can watch and join the movements then let the contribution happen naturally. We also desperately need donations in the form of hardware, bandwidth (server colocation), or cold hard cash. We have transparent reports here to show where every rupiah goes. Please contact @senyumslamet if you want to donate.',
        q3: 'What are the criteria to become a core contributor of the revival project?',
        a3: 'To become one, you need to prove just how geeky you really are and the willingness to get your hands dirty with your terminal emulator. Gen-Z is preferred, although we don\'t have a hard limit on that. Bring the spirit, prove you\'re one of us then you\'re in.',
        q4: 'How to apply?',
        a4: 'Please send your CV to herpiko@gmail.com then we will prepare an interview session for you.',
        q5: 'I am a former contributor of BlankOn, can I join?',
        a5: 'Please send your CV to herpiko@gmail.com then we will prepare an interview session for you.',
        q6: 'Is this a place to learn from scratch?',
        a6: 'Not yet. Definitely not right now. At this stage, we need people who already have intermediate Linux skills and an unhealthy amount of curiosity to help make this revival actually work. Mentors won\'t feed you from zero. You should already be comfortable living inside a terminal and occasionally arguing with it.',
        q7: 'What can I expect from the project? What is new in BlankOn?',
        a7: 'After the revival, BlankOn will reinforce its original goal of improving/leveraging people\'s capabilities by opening a broader range of non-technical roles. BlankOn will also lower contribution barriers while enforcing a stricter Code of Conduct, aimed at ensuring inclusivity and keeping the community healthy and contributor-friendly. The project will also work to maintain an optimal ratio of technical to non-technical contributors to make the technical product (at this point, a Linux distribution) sustainable and healthy.',
        q8: 'What is the success metric of the revival?',
        a8: 'You can download and install a fully-fledged, brand-new BlankOn Linux image, built, baked, and shipped directly from IRGSH. If you can boot it, run it, and hack on it, that is our revival milestone.',
        q9: 'What is the current progress?',
        a9: 'Please check out the Updates section below.',
        q10: 'When will the stable version be released?',
        a10: 'Before the end of 2026. Maybe sooner if you help us by contributing.',
      },
      updatesTitle: 'Updates',
      updates: [
        {
          date: '2026-02-07',
          text: 'The BlankOn Foundation has been legally established. The board members are Rusmanto, Akhmat Safrudin, Slamet Santoso, Iwan Setiawan, and Herpiko Dwi Aguno. The BlankOn Foundation is a separate legal entity established to support the broader open-source ecosystem, communities, and projects in Indonesia. Meanwhile, BlankOn Linux will continue as an independent open-source project, with the Foundation providing full financial and legal support.',
          url: 'https://blankon.id/en/team',
        },
        {
          date: '2026-01-25',
          text: 'Saputro Aryulianto borrowed us a beefy arm64 machine to explore the potential of BlankOn distribution on ARM architecture. We already started to sync arm64 port from upstream.',
          url: 'http://arsip-dev.blankonlinux.id/dev/dists/verbeek/Contents-arm64',
        },
        {
          date: '2026-01-22',
          text: 'Praya, the successor of Manokwari Desktop, is born. You can find the source code on GitHub or test it via our live ISO image.',
          url: 'https://github.com/BlankOn/praya-gnome-shell-extension',
        },
        {
          date: '2026-01-07',
          text: 'IRGSH is up and working end to end on BlankOn cloud infrastructure, ready to package and ship anything.',
          url: 'http://irgsh.blankonlinux.id/submissions/',
        },
        {
          date: '2026-01-01',
          text: 'We have successfully built the first bootable ISO image since the revival. It is built against our own repository, which is synced with the Debian Sid repository.',
          url: 'http://jahitan.blankonlinux.id/',
        },
        {
          date: '2025-12-10',
          text: 'Saputro Aryulianto, a former contributor of the BlankOn project, had parked the blankonlinux.id domain for years as a precaution. Since blankonlinux.or.id was taken by someone else, he donated this .id domain to us. Thank you!',
        },
        {
          date: '2025-12-08',
          text: 'With the help of Estu Fardani, we gained access to rafi.blankon.id. We also coordinated with Mr. Dhanank, who sponsored us on behalf of HostBadak, to extend the sponsorship of Rafi, including its colocation and bandwidth.',
        },
        {
          date: '2025-12-07',
          text: 'We had our first weekly meeting with the core contributors.',
        },
        {
          date: '2025-11-30',
          text: 'We just wrapped up the first BlankOn Revival Project kickoff meeting! Everyone finally got to meet each other and start talking about the revival plans.',
        },
        {
          date: '2025-11-28',
          text: 'STT-NF just became our first sponsor in this revival project, by hosting a Lenovo M920x (8 cores / 64GB RAM / 1TB SSD / 4x Gigabit LAN) in their campus, which will be the new host for IRGSH.',
        },
        {
          date: '2025-11-24',
          text: 'Core contributor positions are now open, targeting young, geeky enthusiasts.',
        },
        {
          date: '2025-07-25',
          text: 'During break of OpenInfra Days 2025, @stwn and @herpiko met and discussed the possibility of reviving the project. New board members are formed, including the current release manager @senyumslamet and former BlankOn contributor @somat.',
        },
        {
          date: '2025-04-08',
          text: 'Utian Ayuba opened a discussion titled "Mau Dibawa Ke Mana BlankOn Linux?" in BlankOn Telegram group.',
        },
      ],
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

export function baseOptions(locale: string, enableSearch = false): BaseLayoutProps {
  const t = getTranslations(locale)

  return {
    i18n,
    searchToggle: {
      enabled: enableSearch,
    },
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
        text: t.team,
        url: `/${locale}/team`,
        active: 'nested-url',
      },
      {
        text: t.download,
        url: `/${locale}/download`,
        active: 'nested-url',
      },
      {
        text: t.wiki,
        url: `/${locale}/wiki/`,
        active: 'nested-url',
      },
      {
        text: t.sponsorship,
        url: 'https://blankon.id/en/sponsorship',
        external: true,
      },
      {
        text: t.donate,
        url: 'https://blankon.id/en/donate',
        external: true,
      },
    ],
  }
}
