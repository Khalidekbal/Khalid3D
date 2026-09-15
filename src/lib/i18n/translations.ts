export type Language = "en" | "ar";

export const translations = {
  en: {
    // Navigation
    nav: {
      brandTagline: "FDM 3D PRINTING",
      instantQuote: "Instant Quote",
      materials: "Materials",
      store: "Pre-Made Hardware",
      trackOrder: "Track Order",
      staffPortal: "Staff Workspace",
      signIn: "Sign In",
      register: "Sign Up",
      signOut: "Sign Out",
      customerPortal: "Customer Portal",
    },

    // Hero Section
    hero: {
      badge: "Industrial FDM 3D Printing • Egypt",
      titleStart: "Fast, Precision 3D Printing",
      titleHighlight: "Powered by Khalid3D",
      subtitle: "Instant pricing based on part weight (grams) & print duration (minutes). Industrial PLA, PETG & TPU with 24-hour turnaround.",
      ctaQuote: "Upload STL & Get Price",
      ctaCatalog: "Explore Hardware Store",
      stat1Value: "±0.15mm",
      stat1Label: "FDM Tolerance",
      stat2Value: "24-48h",
      stat2Label: "Turnaround Time",
      stat3Value: "EGP",
      stat3Label: "Transparent Local Pricing",
    },

    // Live Estimator Widget
    estimator: {
      title: "Quick Cost Estimator",
      subtitle: "Live approximation based on grams & minutes",
      weightLabel: "Part Weight",
      durationLabel: "Print Duration",
      gramsUnit: "grams",
      minutesUnit: "min",
      materialLabel: "Filament Type",
      setupFeeLabel: "Base Calibration",
      estimatedTotal: "Estimated Price",
      launchFullQuote: "Upload STL for Exact Slicing",
    },

    // Features / Service Pillars
    features: {
      badge: "Why Khalid3D",
      title: "Engineered for Reliability",
      subtitle: "Zero hidden costs. Direct client-side STL analysis and high-grade industrial filaments.",
      f1Title: "FDM Exclusivity",
      f1Desc: "Focused on high-performance FDM extrusion for functional parts, brackets, and rugged enclosures.",
      f2Title: "Gram & Minute Transparency",
      f2Desc: "Calculated strictly on actual filament grams and nozzle runtime. Configured fairly by engineering staff.",
      f3Title: "Egypt-Wide Fast Delivery",
      f3Desc: "Fast insured door-to-door courier shipping to Cairo, Giza, Alexandria, and all Egyptian governorates.",
    },

    // Materials Section
    materials: {
      badge: "Engineering Filaments",
      title: "Tested & Calibrated FDM Materials",
      plaTitle: "PLA Tough",
      plaDesc: "High rigidity and precision. Best for visual prototypes, architectural scale models, and snap-fit parts.",
      petgTitle: "PETG Industrial",
      petgDesc: "Impact resistant, water-repellent, heat-tolerant up to 75°C. Ideal for outdoor brackets and mechanical jigs.",
      tpuTitle: "TPU 95A Flexible",
      tpuDesc: "Elastic polyurethane elastomer (Shore 95A). Excellent for vibration dampeners, gaskets, and bumpers.",
      density: "Density",
      costGram: "Cost / Gram",
      costMinute: "Cost / Min",
      selectMaterial: "Order with this Material",
    },

    // How it works
    process: {
      badge: "Simple 3-Step Process",
      title: "From CAD Model to Real Product",
      s1Number: "01",
      s1Title: "Upload STL / CAD",
      s1Desc: "Client-side geometry engine computes volume, grams, and print minutes in milliseconds.",
      s2Number: "02",
      s2Title: "Automated FDM Printing",
      s2Desc: "Printed on calibrated dual-gear FDM machines with exact infill and layer height controls.",
      s3Number: "03",
      s3Title: "Delivered to Your Door",
      s3Desc: "Packed securely and dispatched with live tracking right to your address in Egypt.",
    },

    // Reviews
    reviews: {
      badge: "Verified Testimonials",
      title: "What Egyptian Engineers & Makers Say",
      subtitle: "Real reviews from customers who ordered parts manufactured by Khalid3D.",
      verifiedCustomer: "Verified Customer",
      rateYourOrder: "Review Your Completed Order",
      submitReview: "Submit Review",
      starRating: "Rating (1 to 5)",
      yourFeedback: "Your Experience / Feedback",
    },

    // Auth
    auth: {
      customerTab: "Customer Portal",
      staffTab: "Staff Workspace",
      loginTitle: "Sign in to Khalid3D",
      loginSubtitle: "Manage your 3D printing orders and quotes",
      staffSubtitle: "Restricted to authorized technicians and CAM engineers",
      registerTitle: "Create an Account",
      registerSubtitle: "Start ordering precision FDM parts today",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number (Egypt)",
      signInBtn: "Sign In",
      registerBtn: "Create Customer Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      quickDemoStaff: "Fill Staff Credentials (Demo)",
      quickDemoCustomer: "Fill Customer Credentials (Demo)",
      staffNotice: "Staff workspace allows real-time adjustment of EGP cost per gram & minute and order status tracking.",
    },

    // Quote Page
    quote: {
      title: "INSTANT FDM QUOTE & SLICING",
      subtitle: "Drop your 3D model (STL) for instant volume, weight, and print time calculation in EGP.",
      dropzoneTitle: "Click or Drag STL File Here",
      dropzoneSubtitle: "Calculated client-side in browser • Max 100MB",
      configTitle: "Print Configuration",
      material: "Material",
      infill: "Infill Density",
      layerHeight: "Layer Height",
      quantity: "Quantity",
      breakdownTitle: "Pricing Breakdown",
      gramsCost: "Material Cost (Grams)",
      minutesCost: "Machine Time (Minutes)",
      setupFee: "Setup & Bed Prep",
      subtotal: "Subtotal",
      shipping: "Courier Shipping (Egypt)",
      total: "Total Amount",
      proceedOrder: "Proceed to Checkout",
    },

    // Orders Page
    orders: {
      title: "My 3D Print Orders",
      orderNumber: "Order Number",
      date: "Date",
      status: "Status",
      total: "Total",
      action: "Actions",
      viewDetails: "View Details",
      noOrders: "No orders found.",
    },
  },

  ar: {
    // Navigation
    nav: {
      brandTagline: "خدمات الطباعة ثلاثية الأبعاد FDM",
      instantQuote: "تسعير فوري",
      materials: "الخامات",
      store: "قطع جاهزة للطلب",
      trackOrder: "تتبع طلبك",
      staffPortal: "لوحة تحكم الفريق",
      signIn: "تسجيل الدخول",
      register: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      customerPortal: "بوابة العميل",
    },

    // Hero Section
    hero: {
      badge: "طباعة ثلاثية الأبعاد FDM صناعية • مصر",
      titleStart: "طباعة 3D دقيقة وسريعة",
      titleHighlight: "بأيدي Khalid3D",
      subtitle: "تسعير فوري دقيق مبني على وزن القطعة (بالجرام) ووقت الطباعة (بالدقيقة). خامات صناعية متينة PLA و PETG و TPU مع تصنيع سريع خلال 24 ساعة.",
      ctaQuote: "ارفع ملف STL واحصل على السعر",
      ctaCatalog: "تصفح القطع الجاهزة",
      stat1Value: "±0.15 مم",
      stat1Label: "دقة الأبعاد",
      stat2Value: "24-48 ساعة",
      stat2Label: "وقت التصنيع",
      stat3Value: "جنيه مصري",
      stat3Label: "تسعير محلي شفاف",
    },

    // Live Estimator Widget
    estimator: {
      title: "حاسبة التكلفة السريعة",
      subtitle: "تقدير تقريبي فوري مبني على الجرامات والدقائق",
      weightLabel: "وزن القطعة",
      durationLabel: "وقت الطباعة",
      gramsUnit: "جرام",
      minutesUnit: "دقيقة",
      materialLabel: "نوع الخامة",
      setupFeeLabel: "تجهيز الطابعة والمعايرة",
      estimatedTotal: "السعر التقديري",
      launchFullQuote: "ارفع ملف STL للتشريح الدقيق",
    },

    // Features / Service Pillars
    features: {
      badge: "لماذا تختار Khalid3D",
      title: "صُممت لتقديم أعلى اعتمادية وجودة",
      subtitle: "بدون مصاريف مخفية. تحليل فوري لملف STL وخامات أصلية عالية الجودة.",
      f1Title: "تخصص تام في تقنية FDM",
      f1Desc: "تركيزنا الكامل على تقنية الترسيب المنصهر (FDM) لإنتاج القطع الميكانيكية، الهياكل، وعلب الأجهزة.",
      f2Title: "شفافية مطلقة: جرام + دقيقة",
      f2Desc: "السعر محسوب بالجرامات الفعلية ووقت تشغيل الفونية بدقة، مع إمكانية تعديل الأسعار بعدالة.",
      f3Title: "شحن سريع لجميع المحافظات",
      f3Desc: "شحن سريع ومؤمن لباب بيتك في القاهرة، الجيزة، الإسكندرية، وجميع محافظات مصر.",
    },

    // Materials Section
    materials: {
      badge: "خامات هندسية معتمدة",
      title: "خامات FDM عالية الكفاءة ومعايرة بدقة",
      plaTitle: "PLA Tough مقوى",
      plaDesc: "صلابة عالية ودقة فائقة. ممتاز للنماذج الأولية، المجسمات الهندسية، وعلب الإلكترونيات.",
      petgTitle: "PETG Industrial صناعي",
      petgDesc: "مقاوم للصدمات والماء والحرارة حتى 75 درجة. مثالي للقطع الميكانيكية وحوامل المحركات.",
      tpuTitle: "TPU 95A مرن",
      tpuDesc: "بولي يوريثان مطاطي مرن (Shore 95A). ممتاز لمانعات الاهتزاز، الجوانات، والمصدات.",
      density: "الكثافة",
      costGram: "سعر الجرام",
      costMinute: "سعر الدقيقة",
      selectMaterial: "اطلب بهذه الخامة",
    },

    // How it works
    process: {
      badge: "3 خطوات سهلة",
      title: "من ملف التصميم إلى منتج حقيقي بين يديك",
      s1Number: "01",
      s1Title: "ارفع ملف STL",
      s1Desc: "محرك التشريح يحسب الحجم والوزن ووقت الطباعة بالمللي ثانية مباشرة داخل المتصفح.",
      s2Number: "02",
      s2Title: "طباعة دقيقة بنظام FDM",
      s2Desc: "تُطبع قطعتك على طابعات معايرة بدقة فائقة وبنسبة الحشو وارتفاع الطبقة المطلوبين.",
      s3Number: "03",
      s3Title: "استلام سريع لباب بيتك",
      s3Desc: "تُغلف القطع بعناية فائقة وتُشحن مع رقم تتبع مباشر إلى عنوانك في أي مكان في مصر.",
    },

    // Reviews
    reviews: {
      badge: "آراء عملاؤنا",
      title: "ماذا يقول المهندسون وصناع النماذج في مصر",
      subtitle: "تقييمات حقيقية من عملاء استلموا قطعهم المطبوعة من Khalid3D.",
      verifiedCustomer: "طلب موثق",
      rateYourOrder: "تقييم طلبك المستلم",
      submitReview: "إرسال التقييم",
      starRating: "التقييم (1 إلى 5 نجوم)",
      yourFeedback: "رأيك وتجربتك",
    },

    // Auth
    auth: {
      customerTab: "بوابة العملاء",
      staffTab: "لوحة تحكم الفريق",
      loginTitle: "تسجيل الدخول إلى Khalid3D",
      loginSubtitle: "تابع طلباتك وعروض الأسعار",
      staffSubtitle: "مخصصة للمهندسين والفنيين المصرح لهم",
      registerTitle: "إنشاء حساب جديد",
      registerSubtitle: "ابدأ طباعة أفكارك وقطعك اليوم",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      nameLabel: "الاسم بالكامل",
      phoneLabel: "رقم الهاتف (مصر)",
      signInBtn: "تسجيل الدخول",
      registerBtn: "إنشاء الحساب",
      noAccount: "ليس لديك حساب؟",
      hasAccount: "لديك حساب بالفعل؟",
      quickDemoStaff: "ملء بيانات الفريق تلقائياً (تجربة)",
      quickDemoCustomer: "ملء بيانات العميل تلقائياً (تجربة)",
      staffNotice: "تتيح لوحة الفريق تعديل أسعار الجرام والدقيقة مباشرة ومتابعة ومراجعة الطلبات والتقييمات.",
    },

    // Quote Page
    quote: {
      title: "تسعير وتشريح فوري FDM",
      subtitle: "اسحب ملف STL لتحصل على الوزن والوقت والسعر بالجنيه المصري فوراً.",
      dropzoneTitle: "اضغط أو اسحب ملف STL هنا",
      dropzoneSubtitle: "حساب فوري داخل المتصفح • حتى 100 ميجابايت",
      configTitle: "إعدادات الطباعة",
      material: "نوع الخامة",
      infill: "نسبة الحشو الداخلي",
      layerHeight: "ارتفاع الطبقة",
      quantity: "الكمية",
      breakdownTitle: "تفاصيل التكلفة",
      gramsCost: "تكلفة الخامة (جرامات)",
      minutesCost: "وقت تشغيل الطابعة (دقائق)",
      setupFee: "المعايرة وتجهيز السطح",
      subtotal: "الإجمالي الفرعي",
      shipping: "الشحن الداخلي (مصر)",
      total: "المبلغ الإجمالي",
      proceedOrder: "متابعة لتأكيد الطلب",
    },

    // Orders Page
    orders: {
      title: "طلبات الطباعة ثلاثية الأبعاد",
      orderNumber: "رقم الطلب",
      date: "التاريخ",
      status: "الحالة",
      total: "الإجمالي",
      action: "إجراءات",
      viewDetails: "عرض التفاصيل",
      noOrders: "لا توجد طلبات سابقة.",
    },
  },
};
