import { ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { i18n } from '@/lib/i18n'

const externalDevLinks = [
  // IRGSH, Packages and Security navigate in place; the rest open in a new tab.
  { text: 'IRGSH', url: 'https://irgsh.blankonlinux.id/', sameTab: true },
  { text: 'Packages', url: 'https://packages.blankonlinux.id/', sameTab: true },
  { text: 'Security', url: 'https://security.blankonlinux.id/', sameTab: true },
  { text: 'Jahitan', url: 'https://jahitan.blankonlinux.id/', icon: true },
  { text: 'Arsip', url: 'https://arsip.blankonlinux.id/', icon: true },
  { text: 'Arsip Dev', url: 'https://arsip-dev.blankonlinux.id/', icon: true },
  { text: 'Github', url: 'https://github.com/blankon', icon: true },
]

const CLOSE_DELAY_MS = 100

function DevMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const links = [
    { text: 'Team', url: `/${locale}/team`, external: false },
    ...externalDevLinks.map((l) => ({
      ...l,
      external: !('sameTab' in l && l.sameTab),
    })),
  ]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Drop any pending close when the timer is no longer wanted.
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  useEffect(() => cancelClose, [])

  // Devices with a real hovering pointer open the menu on hover; touch devices
  // have no hover state, so they toggle it by tapping the button.
  const canHover = () => window.matchMedia('(hover: hover)').matches

  const openOnHover = () => {
    cancelClose()
    if (canHover()) setOpen(true)
  }

  // Closing lags slightly so brushing past the edge of the menu does not
  // dismiss it mid-move.
  const closeOnHover = () => {
    if (!canHover()) return
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  return (
    <div
      ref={containerRef}
      // On the top bar the item stretches to the full header height instead of
      // relying on padding, so the whole strip triggers the dropdown.
      className="relative max-sm:w-full sm:flex sm:h-14 sm:items-center"
      onMouseEnter={openOnHover}
      onMouseLeave={closeOnHover}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          cancelClose()
          setOpen((value) => (canHover() ? true : !value))
        }}
        className="inline-flex items-center gap-1 px-2 py-0 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground max-sm:py-2 sm:h-full [&_svg]:size-4"
      >
        Development
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {/* Inside the mobile menu the popup would be clipped by the panel, so it
          expands inline there and only floats from `sm` upwards. */}
      <ul
        className={`z-50 min-w-[160px] py-1 transition-all max-sm:w-full sm:absolute sm:right-0 sm:top-full sm:rounded-md sm:border sm:border-fd-border sm:bg-fd-background sm:shadow-md ${
          open ? 'visible opacity-100' : 'invisible opacity-0 max-sm:hidden'
        }`}
      >
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              onClick={() => {
                cancelClose()
                setOpen(false)
              }}
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="flex items-center gap-1.5 py-2 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground max-sm:ps-4 sm:px-4 sm:hover:bg-fd-accent"
            >
              {link.text}
              {'icon' in link && link.icon && (
                <ExternalLink
                  className="size-3.5 shrink-0 text-fd-muted-foreground/70"
                  aria-hidden
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExternalText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ExternalLink
        className="size-3.5 shrink-0 text-fd-muted-foreground/70"
        aria-hidden
      />
    </span>
  )
}

function Logo() {
  return (
    <>
      <img
        src="/logo-black.png"
        alt="BlankOn"
        width={796}
        height={189}
        className="block h-6 w-auto max-w-full shrink-0 object-contain dark:hidden"
      />
      <img
        src="/logo-white.png"
        alt="BlankOn"
        width={796}
        height={189}
        className="hidden h-6 w-auto max-w-full shrink-0 object-contain dark:block"
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
    sneakPeek: {
      heroTitle: 'Menghadirkan BlankOn Linux Sinambung',
      heroTagline: 'Distro Linux rilis bergulir berbasis Debian.',
      scrollHint: 'Gulir ke bawah \u2193',
      panel2Title: 'Pembaruan Paling Mutakhir',
      panel2Body:
        'Dibangun langsung dari Sid, salah satu makhluk yang bergerak paling kencang di alam semesta Linux.',
      panel3Title: 'Dengan Sabuk Pengaman',
      panel3Body:
        'Mekanisme repositori staging dan para kontributor kami menjaga Anda dari liarnya Sid.',
      panel4Title: 'Memperkenalkan Praya',
      panel4Body:
        'Penerus Manokwari Desktop. Praya mewarisi karakter khas Manokwari sekaligus mengikuti perkembangan teknologi modern.',
      learnMore: 'Pelajari lebih lanjut',
      comingSoon: 'Segera hadir\u2026',
      ctaDownload: 'Unduh',
      ctaEngage: 'Bergabung',
      ctaContribute: 'Berkontribusi',
      ctaDonate: 'Donasi',
      // Broken where it should wrap, rather than wherever the width lands.
      credit: [
        'BlankOn Linux Sinambung dipersembahkan oleh',
        'tim BlankOn Revival Project.',
      ],
      creditLink: 'Pelajari lebih lanjut',
    },
    downloadPage: {
      title: 'Unduh BlankOn Linux Sinambung',
      subtitle:
        'Unduh image live BlankOn Linux Sinambung terbaru untuk arsitektur amd64.',
      dailyBuildWarning:
        'Ini adalah ISO jahitan harian (daily build). Mungkin mengandung bug, fitur yang belum stabil, atau bahkan tidak dapat di-boot sama sekali.',
      dailyBuildContribute:
        'Namun, memakai image ini berarti Anda berkesempatan untuk ikut berkontribusi: mengujinya dan melaporkan setiap temuan atau masalah.',
      dailyBuildRepo:
        'Berbeda dengan ISO rilis bergulir yang sudah dipoles dan diuji, image ini mengarah ke lumbung paket arsip-dev.blankonlinux.id, yang mungkin kurang stabil dibandingkan arsip.blankonlinux.id.',
      zsync: 'Zsync',
      zsyncNote:
        'Jika ingin terus mengikuti jahitan harian, Anda dapat memakai perintah zsync berikut untuk menghemat bandwidth.',
      downloadButton: 'Unduh ISO',
      fileDetails: 'Detail Berkas',
      filename: 'Nama Berkas',
      architecture: 'Arsitektur',
      type: 'Tipe Berkas',
      typeValue: 'Live Image (Hybrid ISO)',
      releaseType: 'Rilis',
      releaseTypeValue: 'Jahitan Harian',
      rollingTab: 'ISO Rilis Bergulir',
      developmentTab: 'ISO Pengembangan',
      rollingReleaseValue: 'Rilis Bergulir',
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
        'Sebuah usaha untuk membangkitkan kembali proyek BlankOn Linux',
        'yang sudah lama mati suri dari kedalaman /dev/null',
      ],
      downloadIso: 'Unduh ISO',
      readDocs: 'Dokumentasi',
      aboutTitle: 'Tentang',
      aboutDescription:
        'BlankOn Linux adalah distribusi Linux Indonesia berbasis Debian yang telah menjadi gerakan open-source sejak 2004. Setelah bertahun-tahun tidak aktif, tim baru telah membangun ulang infrastruktur dan merilis ISO pertama yang dapat di-boot dari sistem build IRGSH kami sendiri. Mari unduh, jalankan, dan kembangkan bersama-sama.',
      teamTitle: 'Tim Revival',
      revivalComplete:
        'Per 12 September 2026, upaya revival dinyatakan selesai. Terima kasih kepada seluruh kontributor, donatur, dan sponsor revival, serta komunitas yang masih mempercayai visi kami.',
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
        a4: 'Silakan kirim CV Anda ke herpiko@blankon.id dan kami akan mempersiapkan sesi wawancara untuk Anda.',
        q5: 'Saya mantan kontributor BlankOn, apakah saya bisa bergabung?',
        a5: 'Silakan kirim CV Anda ke herpiko@blankon.id dan kami akan mempersiapkan sesi wawancara untuk Anda.',
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
          date: '2026-09-12',
          text: 'Release candidate 1 untuk Sinambung dilepas. Tinggal satu langkah lagi menuju rilis final. Hari ini juga kami tandai sebagai selesainya upaya revival.',
        },
        {
          date: '2026-09-11',
          text: 'arsip-dev.blankonlinux.id telah tersinkron ke arsip.blankonlinux.id. Ini menandai rampungnya seluruh alur kerja dan infrastruktur pengembangan distro.',
          url: 'https://arsip.blankonlinux.id/',
        },
        {
          date: '2026-09-05',
          text: 'Kami sedang menjajaki skema rilis bergulir. Nama kode untuk rilis bergulir ini adalah Sinambung, diambil dari kata "berkesinambungan". Baca RFC-nya di sini.',
          url: 'https://gist.github.com/herpiko/a1cde839af39636c8bc71929dfa709b9/revisions',
        },
        {
          date: '2026-09-04',
          text: 'Pembaruan besar untuk IRGSH, pabrik paket BlankOn. IRGSH kini mendukung banyak distribusi sekaligus dan dapat mengimpor paket langsung dari sumber lain, terutama untuk mengambil pembaruan paket dan pembaruan keamanan. Pendekatan multi-distribusi ini juga membuka jalan bagi dukungan multi-arsitektur di masa depan.',
          url: 'http://irgsh.blankonlinux.id/',
        },
        {
          date: '2026-08-31',
          text: 'Salah satu kontributor inti kami menyumbangkan sebuah mesin bertenaga. Dengan ini kami dapat memensiunkan mesin frankenstein di STT-NF dan memindahkan infrastruktur kami ke sistem yang layak. Terima kasih, Raska! Kini proyek ini memiliki tiga mesin sponsor, yang akan digunakan bersama Yayasan sekaligus untuk mendukung inisiatif open-source lain di luar Yayasan yang memiliki visi serupa.',
          url: 'https://blankon.id/en/news/8labs-corporate-sponsor',
        },
        {
          date: '2026-08-03',
          text: 'Proses pemaketan kami kini dapat direproduksi. Jika repositori kami rusak, kami cukup mengulang proses pemaketan yang terdaftar di PackageList.md.',
          url: 'https://github.com/BlankOn/revival/blob/main/Packages/PackageList.md',
        },
        {
          date: '2026-07-21',
          text: 'Administrasi Yayasan BlankOn telah rampung. Kami kini memiliki rekening bank resmi yang dapat dipercaya dan digunakan untuk menerima donasi.',
          url: 'https://blankon.id/en/news/blankon-foundation-official-bank-account-number',
        },
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
      getInvolvedTitle: 'Mari Bergabung',
      getInvolvedDescription:
        'Bergabunglah dengan grup Telegram kami untuk mengikuti perkembangan dan berkontribusi.',
      joinTelegram: 'Gabung Telegram',
      howToContribute: 'Cara berkontribusi',
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
    sneakPeek: {
      heroTitle: 'Unleashing BlankOn Linux Sinambung',
      heroTagline: 'A rolling release Linux distro based on Debian.',
      scrollHint: 'Scroll down \u2193',
      panel2Title: 'Bleeding Edge Updates',
      panel2Body:
        'Built straight from Sid, one of the fastest-moving things in the Linux universe.',
      panel3Title: 'With Seatbelt',
      panel3Body:
        "Our staging repository mechanism and our contributors are guarding you from Sid's sharp edges.",
      panel4Title: 'Introducing Praya',
      panel4Body:
        "The successor to Manokwari Desktop. Praya inherits Manokwari's unique character while keeping up with a modern tech stack.",
      learnMore: 'Learn more',
      comingSoon: 'Coming soon\u2026',
      ctaDownload: 'Download',
      ctaEngage: 'Engage',
      ctaContribute: 'Contribute',
      ctaDonate: 'Donate',
      // Broken where it should wrap, rather than wherever the width lands.
      credit: [
        'BlankOn Linux Sinambung is brought to you by',
        'the BlankOn Revival Project team.',
      ],
      creditLink: 'Learn more',
    },
    downloadPage: {
      title: 'Download BlankOn Linux Sinambung',
      subtitle:
        'Get the latest BlankOn Linux Sinambung live image for amd64 architecture.',
      dailyBuildWarning:
        'This is a daily build ISO. It may contain bugs, unstable features, or may not even boot at all.',
      dailyBuildContribute:
        'Using this build, though, is a chance to contribute: test it and report anything you find.',
      dailyBuildRepo:
        'Unlike the polished and tested rolling release ISO, this image points at the arsip-dev.blankonlinux.id package repository, which may be less stable than arsip.blankonlinux.id.',
      zsync: 'Zsync',
      zsyncNote:
        'If you want to keep following the daily build, you can use this zsync command to save bandwidth.',
      downloadButton: 'Download ISO',
      fileDetails: 'File Details',
      filename: 'Filename',
      architecture: 'Architecture',
      type: 'File Type',
      typeValue: 'Live Image (Hybrid ISO)',
      releaseType: 'Release',
      releaseTypeValue: 'Daily Build',
      rollingTab: 'Rolling Release ISO',
      developmentTab: 'Development ISO',
      rollingReleaseValue: 'Rolling Release',
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
        'An attempt to bring back the long-dormant BlankOn Linux project',
        'from the depths of /dev/null',
      ],
      downloadIso: 'Download ISO',
      readDocs: 'Documentation',
      aboutTitle: 'About',
      aboutDescription:
        'BlankOn Linux is an Indonesian Linux distribution based on Debian and an open-source movement since 2004. After years of dormancy, a new team has rebuilt the infrastructure and shipped the first bootable ISO from our own IRGSH build system. Download it, boot it, hack on it.',
      teamTitle: 'The Revival Team',
      revivalComplete:
        'As of September 12, 2026, the revival is considered complete. Our thanks go to every contributor, donor and sponsor of the revival, and to the community who still trust our vision.',
      sponsorsTitle: 'Sponsors',
      faqTitle: 'FAQ',
      faq: {
        q1: 'What is BlankOn Revival Project?',
        a1: 'An attempt to bring back the long-dormant BlankOn project from the depths of /dev/null.',
        q2: 'How can I contribute?',
        a2: 'Until the revival is complete, we will be operating with technical contributors only. We are opening positions for core contributors, but the selection process will be strict for several reasons. We collaborate in a public Telegram group where anyone can watch and join the movements then let the contribution happen naturally. We also desperately need donations in the form of hardware, bandwidth (server colocation), or cold hard cash. We have transparent reports here to show where every rupiah goes. Please contact @senyumslamet if you want to donate.',
        q3: 'What are the criteria to become a core contributor of the revival project?',
        a3: "To become one, you need to prove just how geeky you really are and the willingness to get your hands dirty with your terminal emulator. Gen-Z is preferred, although we don't have a hard limit on that. Bring the spirit, prove you're one of us then you're in.",
        q4: 'How to apply?',
        a4: 'Please send your CV to herpiko@blankon.id then we will prepare an interview session for you.',
        q5: 'I am a former contributor of BlankOn, can I join?',
        a5: 'Please send your CV to herpiko@blankon.id then we will prepare an interview session for you.',
        q6: 'Is this a place to learn from scratch?',
        a6: "Not yet. Definitely not right now. At this stage, we need people who already have intermediate Linux skills and an unhealthy amount of curiosity to help make this revival actually work. Mentors won't feed you from zero. You should already be comfortable living inside a terminal and occasionally arguing with it.",
        q7: 'What can I expect from the project? What is new in BlankOn?',
        a7: "After the revival, BlankOn will reinforce its original goal of improving/leveraging people's capabilities by opening a broader range of non-technical roles. BlankOn will also lower contribution barriers while enforcing a stricter Code of Conduct, aimed at ensuring inclusivity and keeping the community healthy and contributor-friendly. The project will also work to maintain an optimal ratio of technical to non-technical contributors to make the technical product (at this point, a Linux distribution) sustainable and healthy.",
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
          date: '2026-09-12',
          text: 'Release candidate 1 for Sinambung is unleashed. We are one step away from the final release. We also mark this day as the completion of the revival effort.',
        },
        {
          date: '2026-09-11',
          text: 'arsip-dev.blankonlinux.id is synced to arsip.blankonlinux.id, which marks the whole workflow and infrastructure of the distro development as complete.',
          url: 'https://arsip.blankonlinux.id/',
        },
        {
          date: '2026-09-05',
          text: 'We are exploring a rolling release scheme. The codename for this rolling release is Sinambung, taken from "berkesinambungan". Read the RFC here.',
          url: 'https://gist.github.com/herpiko/a1cde839af39636c8bc71929dfa709b9/revisions',
        },
        {
          date: '2026-09-04',
          text: 'A major update for IRGSH, the packaging factory of the distro. IRGSH now supports multiple distributions and can import packages directly from other sources, mainly to cherry-pick package updates and security updates. The multi-distro approach also opens the door to multi-architecture support in the future.',
          url: 'http://irgsh.blankonlinux.id/',
        },
        {
          date: '2026-08-31',
          text: 'One of our core contributors sponsored a beefy machine. This lets us retire the frankenstein machine at STT-NF and migrate our infrastructure onto a proper one. Thank you, Raska! The project now runs on three sponsored machines, which will serve the work of the Foundation and also support other open-source initiatives outside the Foundation that share the same vision.',
          url: 'https://blankon.id/en/news/8labs-corporate-sponsor',
        },
        {
          date: '2026-08-03',
          text: 'Our packaging process is now reproducible. If our repository breaks, we simply repeat the packaging process listed in PackageList.md.',
          url: 'https://github.com/BlankOn/revival/blob/main/Packages/PackageList.md',
        },
        {
          date: '2026-07-21',
          text: 'The BlankOn Foundation paperwork is now complete. We have an official bank account that can be trusted and used for donations.',
          url: 'https://blankon.id/en/news/blankon-foundation-official-bank-account-number',
        },
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
      howToContribute: 'How to contribute',
    },
  },
}

export function getTranslations(locale: string) {
  if (locale in translations) {
    return translations[locale as keyof typeof translations]
  }
  return translations.id
}

export function baseOptions(
  locale: string,
  enableSearch = false,
): BaseLayoutProps {
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
        type: 'custom',
        children: <DevMenu locale={locale} />,
      },
      {
        text: <ExternalText>{t.sponsorship}</ExternalText>,
        url: 'https://blankon.id/en/sponsorship',
        external: true,
      },
      {
        text: <ExternalText>{t.donate}</ExternalText>,
        url: 'https://blankon.id/en/donate',
        external: true,
      },
    ],
  }
}
