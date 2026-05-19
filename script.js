const revealNodes = document.querySelectorAll('.reveal');
const topbar = document.querySelector('.topbar');
const themeCheckbox = document.querySelector('.theme-switch__checkbox');
const menuToggle = document.querySelector('.menu-toggle');
const menuBackdrop = document.querySelector('.menu-backdrop');
const menuClose = document.querySelector('.menu-close');
const menuLinks = document.querySelectorAll('.header-panel .nav a');
const topbarControls = document.querySelector('.topbar-controls');
const headerPanel = document.querySelector('.header-panel');
const headerNav = headerPanel?.querySelector('.nav');
const faqItems = document.querySelectorAll('.faq-item');
const themeSwitch = themeCheckbox?.closest('.theme-switch');
const externalShopUrl = 'https://www.dbucha.com/products/liquidy-merrymi-salts-30ml-sole-nikotynowe';
const cartSheet = document.getElementById('cartSheet');
const cartSheetBackdrop = document.getElementById('cartSheetBackdrop');
const cartSheetClose = document.querySelector('.cart-sheet-close');
const cartSheetImage = document.getElementById('cartSheetImage');
const cartSheetFlavor = document.getElementById('cartSheetFlavor');
const cartSheetProductName = document.getElementById('cartSheetProductName');
const cartSheetTags = document.getElementById('cartSheetTags');
const cartSheetFlavorInfo = document.getElementById('cartSheetFlavorInfo');
const cartSheetFaqList = document.getElementById('cartSheetFaqList');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyInput = document.getElementById('qtyInput');
const ratingsSection = document.querySelector('.ratings-section');
const ratingsTrackTop = document.getElementById('ratingsTrackTop');
const ratingsTrackBottom = document.getElementById('ratingsTrackBottom');
const footerFlavorLinks = document.querySelectorAll('.footer-flavor-link');

function relocateThemeSwitch() {
  if (!themeSwitch || !topbarControls || !headerPanel || !headerNav || !menuToggle) return;

  if (window.innerWidth <= 760) {
    if (themeSwitch.parentElement !== topbarControls) {
      topbarControls.insertBefore(themeSwitch, menuToggle);
    }
  } else if (themeSwitch.parentElement !== headerPanel) {
    headerPanel.appendChild(themeSwitch);
  }
}

relocateThemeSwitch();
window.addEventListener('resize', relocateThemeSwitch);

if (menuToggle) {
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menuBackdrop?.addEventListener('click', closeMenu);
  menuClose?.addEventListener('click', closeMenu);
  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

if (themeCheckbox) {
  const savedTheme = localStorage.getItem('merrymi-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.body.dataset.theme = initialTheme;
  themeCheckbox.checked = initialTheme === 'dark';

  themeCheckbox.addEventListener('change', () => {
    const nextTheme = themeCheckbox.checked ? 'dark' : 'light';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem('merrymi-theme', nextTheme);
  });
}

faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-trigger');
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    faqItems.forEach((faq) => {
      faq.classList.remove('is-open');
      const faqTrigger = faq.querySelector('.faq-trigger');
      faqTrigger?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

function closeCartSheet() {
  document.body.classList.remove('cart-sheet-open');
  cartSheet?.setAttribute('aria-hidden', 'true');
}

function renderCartSheetFaq(product, badge) {
  if (!cartSheetFaqList) return;

  const tags = product.tags.map(toTitleCase).join(', ');
  const faqItems = [
    {
      q: `🍓 Czym wyróżnia się wariant ${product.name}?`,
      a: `To profil ${badge.label.toLowerCase()} z nutami: ${tags}. Smak został zaprojektowany tak, aby był wyraźny, ale przyjemnie gładki podczas codziennego użytkowania.`,
    },
    {
      q: '💨 Czy ten e-liquid nadaje się do codziennego wapowania?',
      a: 'Tak. Kompozycja MerryMi stawia na stabilność aromatu i komfort użytkowania, dzięki czemu dobrze sprawdza się jako wybór na cały dzień.',
    },
    {
      q: '🧪 Co wyróżnia e-liquidy MerryMi?',
      a: 'MerryMi koncentruje się na jakości składników, powtarzalnym smaku i nowoczesnych owocowych profilach, które utrzymują charakter przez całe użytkowanie.',
    },
    {
      q: '🔞 Dla kogo jest produkt MerryMi?',
      a: 'Produkt jest przeznaczony wyłącznie dla osób pełnoletnich. Należy używać go odpowiedzialnie i przechowywać poza zasięgiem dzieci.',
    },
  ];

  cartSheetFaqList.innerHTML = faqItems
    .map(
      (item, index) => `
      <details class="cart-sheet-faq-item" ${index === 0 ? 'open' : ''}>
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>
    `
    )
    .join('');
}

function openCartSheet(product) {
  if (!cartSheet || !product) return;

  const badge = getProductBadge(product);
  cartSheetImage.src = product.image;
  cartSheetImage.alt = `MerryMi Liquidy ${product.name}`;
  cartSheetFlavor.textContent = badge.label;
  cartSheetProductName.textContent = product.name;
  cartSheetTags.textContent = product.tags.map(toTitleCase).join(' · ');
  cartSheetFlavorInfo.textContent =
    `🍹 Wariant ${badge.label.toLowerCase()} z linii MerryMi oferuje wyrazisty smak i gładki charakter e-liquidu, idealny do codziennego użytkowania vape.`;
  renderCartSheetFaq(product, badge);
  if (qtyInput) qtyInput.value = '1';

  document.body.classList.add('cart-sheet-open');
  cartSheet.setAttribute('aria-hidden', 'false');
}

document.addEventListener('click', (event) => {
  const cartLink = event.target.closest('.cart-btn');
  if (cartLink) {
    event.preventDefault();
    cartLink.classList.remove('is-clicked');
    void cartLink.offsetWidth;
    cartLink.classList.add('is-clicked');

    const productIndex = Number(cartLink.dataset.productIndex);
    const product = Number.isFinite(productIndex) ? products[productIndex] : null;
    openCartSheet(product);
    return;
  }

  if (event.target === cartSheetBackdrop || event.target === cartSheetClose) {
    closeCartSheet();
  }
});

qtyMinus?.addEventListener('click', () => {
  if (!qtyInput) return;
  const nextValue = Math.max(1, Number(qtyInput.value || 1) - 1);
  qtyInput.value = String(nextValue);
});

qtyPlus?.addEventListener('click', () => {
  if (!qtyInput) return;
  const nextValue = Math.max(1, Number(qtyInput.value || 1) + 1);
  qtyInput.value = String(nextValue);
});

qtyInput?.addEventListener('input', () => {
  const value = Number(qtyInput.value || 1);
  if (!Number.isFinite(value) || value < 1) {
    qtyInput.value = '1';
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCartSheet();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const variants = [
  'merrymi-olejki-liquidy-Aloe-Blackcurrant.jpg',
  'merrymi-olejki-liquidy-Breezy-Lemon-Berry.jpg',
  'merrymi-olejki-liquidy-Crazy-Blueberry.jpg',
  'merrymi-olejki-liquidy-Desert-Candy.jpg',
  'merrymi-olejki-liquidy-Dragon-Fruit-Ice.jpg',
  'merrymi-olejki-liquidy-Fanta.jpg',
  'merrymi-olejki-liquidy-Fizzy-Cherry.jpg',
  'merrymi-olejki-liquidy-Forest-Berries.jpg',
  'merrymi-olejki-liquidy-Frozen-Grape.jpg',
  'merrymi-olejki-liquidy-Grape-Berry.jpg',
  'merrymi-olejki-liquidy-Grapefruit-Refresher.jpg',
  'merrymi-olejki-liquidy-Green-Apple.jpg',
  'merrymi-olejki-liquidy-Iced-Peach-Melon.jpg',
  'merrymi-olejki-liquidy-Jager-Red-Energy.jpg',
  'merrymi-olejki-liquidy-Kiwi-Passion-Fruit-Guava.jpg',
  'merrymi-olejki-liquidy-Lemon-Mojito.jpg',
  'merrymi-olejki-liquidy-Lush-Ice.jpg',
  'merrymi-olejki-liquidy-Miami-Mint.jpg',
  'merrymi-olejki-liquidy-Mixed-Berries.jpg',
  'merrymi-olejki-liquidy-Orange-Dragon.jpg',
  'merrymi-olejki-liquidy-Peach-lemonade.jpg',
  'merrymi-olejki-liquidy-Prime-Strawberry.jpg',
  'merrymi-olejki-liquidy-Red-Energy-Ice.jpg',
  'merrymi-olejki-liquidy-Strawberry-Raspberry-Cherry-Ice.jpg',
  'merrymi-olejki-liquidy-Tropical-Citrus-Fizz.jpg',
];

const STOP_WORDS = new Set([
  'ice',
  'iced',
  'frozen',
  'mixed',
  'prime',
  'breezy',
  'crazy',
  'forest',
  'red',
  'desert',
  'tropical',
  'refresher',
  'fizzy',
  'energy',
]);

const TAG_ALIASES = {
  berries: 'berry',
  lemonade: 'lemon',
};

const CATEGORY_DEFS = [
  {
    id: 'citrus',
    label: 'Cytrus',
    emoji: '🍋',
    note: 'Rześkie i lekkie kompozycje cytrusowe.',
    keywords: ['lemon', 'orange', 'grapefruit', 'citrus', 'lime'],
  },
  {
    id: 'berries',
    label: 'Jagodowe',
    emoji: '🍓',
    note: 'Najczęściej wybierane profile jagodowe i leśne.',
    keywords: ['berry', 'blueberry', 'raspberry', 'strawberry', 'cherry', 'blackcurrant'],
  },
  {
    id: 'grape',
    label: 'Winogrono',
    emoji: '🍇',
    note: 'Słodkie i soczyste warianty z nutą winogron.',
    keywords: ['grape'],
  },
  {
    id: 'peach',
    label: 'Brzoskwinia',
    emoji: '🍑',
    note: 'Gładkie, owocowe smaki o aksamitnym charakterze.',
    keywords: ['peach', 'melon'],
  },
  {
    id: 'tropical',
    label: 'Egzotyczne',
    emoji: '🥝',
    note: 'Tropikalne połączenia pełne egzotycznych owoców.',
    keywords: ['kiwi', 'passion', 'guava', 'dragon', 'fruit', 'aloe', 'mint', 'apple'],
  },
];

const flavorTabs = document.getElementById('flavorTabs');
const flavorNote = document.getElementById('flavorNote');
const variantGrid = document.getElementById('variantGrid');

let activeCategory = 'all';
let isAnimating = false;

function toTitleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseName(filename) {
  return filename
    .replace('merrymi-olejki-liquidy-', '')
    .replace('.jpg', '')
    .replaceAll('-', ' ');
}

function parseTags(name) {
  return [...new Set(
    name
      .toLowerCase()
      .split(/[^a-z]+/)
      .map((token) => TAG_ALIASES[token] || token)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  )];
}

function findCategories(tags) {
  return CATEGORY_DEFS
    .filter((category) => category.keywords.some((keyword) => tags.includes(keyword)))
    .map((category) => category.id);
}

const products = variants.map((filename) => {
  const rawName = parseName(filename);
  const tags = parseTags(rawName);
  return {
    name: toTitleCase(rawName),
    image: `images/smaki/${filename}`,
    tags,
    categories: findCategories(tags),
  };
});

const REVIEW_AUTHORS = [
  'Kasia', 'Marta', 'Julia', 'Ania', 'Agnieszka', 'Oliwia', 'Natalia',
  'Monika', 'Paweł', 'Michał', 'Krzysztof', 'Bartek', 'Patryk', 'Tomek',
  'Kamil', 'Adrian',
];

const REVIEW_TEXTS = [
  'Bardzo czysty smak i przyjemny aromat przez cały dzień.',
  'Najlepszy balans słodyczy i świeżości jaki miałem.',
  'Smak stabilny od początku do końca, mega na plus.',
  'Bardzo udany profil, wracam po ten wariant regularnie.',
  'Gładki i wyrazisty liquid, idealny na codzienne użycie.',
  'Świetna jakość, smak dokładnie taki jak opisano.',
];

const categoryCount = {};
products.forEach((product) => {
  product.categories.forEach((categoryId) => {
    categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
  });
});

const tabsConfig = [
  {
    id: 'all',
    label: 'Wszystkie',
    emoji: '🍹',
    note: 'Wszystkie warianty smakowe MerryMi Liquidy.',
  },
  ...CATEGORY_DEFS.filter((category) => (categoryCount[category.id] || 0) > 1),
];

const TAG_EMOJI = {
  lemon: '🍋',
  orange: '🍊',
  grapefruit: '🍊',
  lime: '🍋',
  berry: '🫐',
  blueberry: '🫐',
  raspberry: '🍓',
  strawberry: '🍓',
  cherry: '🍒',
  blackcurrant: '🫐',
  grape: '🍇',
  peach: '🍑',
  melon: '🍈',
  kiwi: '🥝',
  passion: '🍍',
  guava: '🥭',
  dragon: '🐉',
  fruit: '🥭',
  mint: '🌿',
  apple: '🍏',
  aloe: '🌿',
};

const TAG_BADGE_PL = {
  lemon: { key: 'citrus', label: 'Cytrusowy' },
  orange: { key: 'citrus', label: 'Cytrusowy' },
  grapefruit: { key: 'citrus', label: 'Cytrusowy' },
  lime: { key: 'citrus', label: 'Cytrusowy' },
  berry: { key: 'berry', label: 'Jagodowy' },
  blueberry: { key: 'berry', label: 'Jagodowy' },
  raspberry: { key: 'berry', label: 'Jagodowy' },
  strawberry: { key: 'strawberry', label: 'Truskawkowy' },
  cherry: { key: 'cherry', label: 'Wiśniowy' },
  blackcurrant: { key: 'currant', label: 'Porzeczkowy' },
  grape: { key: 'grape', label: 'Winogronowy' },
  peach: { key: 'peach', label: 'Brzoskwiniowy' },
  melon: { key: 'melon', label: 'Melonowy' },
  kiwi: { key: 'kiwi', label: 'Kiwi' },
  passion: { key: 'tropical', label: 'Egzotyczny' },
  guava: { key: 'tropical', label: 'Egzotyczny' },
  dragon: { key: 'dragon', label: 'Smoczy' },
  fruit: { key: 'fruit', label: 'Owocowy' },
  mint: { key: 'mint', label: 'Miętowy' },
  apple: { key: 'apple', label: 'Jabłkowy' },
  aloe: { key: 'aloe', label: 'Aloesowy' },
};

function getProductEmoji(product) {
  for (const tag of product.tags) {
    if (TAG_EMOJI[tag]) {
      return TAG_EMOJI[tag];
    }
  }
  return '🍹';
}

function getProductBadge(product) {
  for (const tag of product.tags) {
    if (TAG_BADGE_PL[tag]) {
      return TAG_BADGE_PL[tag];
    }
  }
  return { key: 'fruit', label: 'Owocowy' };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getProductRating(product) {
  const hash = hashString(product.name);
  const score = (4.5 + (hash % 6) * 0.1).toFixed(1);
  const ratingsCount = 120 + (hash % 860);
  return { score, ratingsCount };
}

function getReviewItems() {
  return products.slice(0, 12).map((product, index) => {
    const rating = getProductRating(product);
    const flavor = getProductBadge(product).label;
    return {
      name: REVIEW_AUTHORS[index % REVIEW_AUTHORS.length],
      rating: rating.score,
      flavor,
      image: product.image,
      text: REVIEW_TEXTS[index % REVIEW_TEXTS.length],
    };
  });
}

function renderRatingsSection() {
  if (!ratingsTrackTop || !ratingsTrackBottom) return;

  const reviewItems = getReviewItems();
  const topItems = reviewItems.slice(0, 6);
  const bottomItems = reviewItems.slice(6);

  const renderCards = (items) =>
    items
      .map(
        (item) => `
        <article class="rating-card">
          <img src="${item.image}" alt="Smak MerryMi ${item.flavor}" loading="lazy" />
          <div>
            <div class="rating-head">
              <strong>${item.name}</strong>
              <span class="rating-score"><span>⭐</span>${item.rating}</span>
            </div>
            <p class="rating-flavor">Smak: ${item.flavor}</p>
            <p class="rating-text">${item.text}</p>
          </div>
        </article>
      `
      )
      .join('');

  const topMarkup = renderCards(topItems);
  const bottomMarkup = renderCards(bottomItems);
  ratingsTrackTop.innerHTML = `${topMarkup}${topMarkup}`;
  ratingsTrackBottom.innerHTML = `${bottomMarkup}${bottomMarkup}`;
}

function getStructuredDataProductName(productName) {
  const categoryPattern = /\b(liquid|liquidy|olejek|olejki|s[oó]l nikotynowa|sole nikotynowe)\b/i;
  return categoryPattern.test(productName)
    ? productName
    : `Liquid do e papierosa ${productName} 30ml`;
}

function getStructuredDataFaqItems() {
  return [...document.querySelectorAll('.faq-list .faq-item')]
    .map((item) => {
      const question = item.querySelector('.faq-trigger')?.childNodes?.[0]?.textContent.trim();
      const answer = item.querySelector('.faq-content p')?.textContent.trim().replace(/\s+/g, ' ');

      if (!question || !answer) return null;

      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      };
    })
    .filter(Boolean);
}

function renderStructuredData() {
  const officialSiteUrl = 'https://lq-merrymi.pl/';
  const productCollectionUrl = `${officialSiteUrl}#produkty`;
  const organizationId = `${officialSiteUrl}#organization`;
  const websiteId = `${officialSiteUrl}#website`;
  const collectionId = `${officialSiteUrl}#produkty`;
  const itemListId = `${officialSiteUrl}#produkty-list`;

  const itemListElements = products.map((product, index) => {
    const productId = `${officialSiteUrl}#product-${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`;

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': productId,
        '@type': 'Product',
        name: getStructuredDataProductName(product.name),
        image: new URL(product.image, officialSiteUrl).href,
        description: `MerryMi Liquidy 30ml w wariancie smakowym ${product.name}. Produkt przeznaczony wyłącznie dla pełnoletnich użytkowników e-papierosów.`,
        brand: {
          '@id': organizationId,
        },
        category: 'Liquidy do e papierosa / sole nikotynowe',
        url: productCollectionUrl,
        // Price, currency, stock status, contacts and social profiles are omitted because they are not present in this static site.
        offers: {
          '@type': 'Offer',
          url: externalShopUrl,
          itemCondition: 'https://schema.org/NewCondition',
        },
      },
    };
  });

  const faqItemsForSchema = getStructuredDataFaqItems();

  const graph = [
    {
      '@type': 'OnlineStore',
      '@id': organizationId,
      name: 'MerryMi Liquidy',
      url: officialSiteUrl,
      logo: `${officialSiteUrl}logo.png`,
      image: `${officialSiteUrl}images/merrymi-lq-olejki-do-epapierosa.png`,
      areaServed: {
        '@type': 'Country',
        name: 'Polska',
      },
      availableLanguage: 'pl-PL',
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: 'MerryMi Liquidy',
      url: officialSiteUrl,
      inLanguage: 'pl-PL',
      publisher: {
        '@id': organizationId,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${officialSiteUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Strona główna',
          item: officialSiteUrl,
        },
      ],
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${officialSiteUrl}#site-navigation`,
      name: ['Start', 'Smaki', 'Produkty', 'FAQ', 'Kontakt'],
      url: [
        officialSiteUrl,
        `${officialSiteUrl}#smaki`,
        productCollectionUrl,
        `${officialSiteUrl}#faq`,
        `${officialSiteUrl}#kontakt`,
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': collectionId,
      name: 'Olejki do e papierosa - MerryMi Liquidy',
      url: productCollectionUrl,
      isPartOf: {
        '@id': websiteId,
      },
      about: {
        '@id': organizationId,
      },
      mainEntity: {
        '@id': itemListId,
      },
      inLanguage: 'pl-PL',
    },
    {
      '@type': 'ItemList',
      '@id': itemListId,
      name: 'Warianty smakowe MerryMi Liquidy 30ml',
      numberOfItems: itemListElements.length,
      itemListElement: itemListElements,
    },
  ];

  if (faqItemsForSchema.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${officialSiteUrl}#faq`,
      url: `${officialSiteUrl}#faq`,
      inLanguage: 'pl-PL',
      mainEntity: faqItemsForSchema,
    });
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  document.getElementById('merrymi-json-ld')?.remove();

  const schemaScript = document.createElement('script');
  schemaScript.id = 'merrymi-json-ld';
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(structuredData);

  document.head.appendChild(schemaScript);
}

function renderTabs() {
  flavorTabs.innerHTML = tabsConfig
    .map(
      (tab) => `
      <button
        class="tab ${tab.id === activeCategory ? 'is-active' : ''}"
        data-category="${tab.id}"
        role="tab"
        aria-selected="${tab.id === activeCategory}"
      >
        <span class="tab-emoji" aria-hidden="true">${tab.emoji || '🍹'}</span>
        <span class="tab-label">${tab.label}</span>
      </button>
    `
    )
    .join('');

  flavorTabs.querySelectorAll('.tab').forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      const nextCategory = tabButton.dataset.category;
      if (!nextCategory || nextCategory === activeCategory || isAnimating) {
        return;
      }

      isAnimating = true;
      variantGrid.classList.add('is-exiting');

      setTimeout(() => {
        activeCategory = nextCategory;
        const activeTab = tabsConfig.find((tab) => tab.id === activeCategory);
        flavorNote.textContent = activeTab?.note || 'Warianty MerryMi Liquidy.';
        renderTabs();
        renderProducts();
        variantGrid.classList.remove('is-exiting');

        setTimeout(() => {
          isAnimating = false;
        }, 260);
      }, 180);
    });
  });
}

function renderProducts() {
  const visibleProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.categories.includes(activeCategory));

  variantGrid.innerHTML = visibleProducts
    .map(
      (product, index) => {
        const badge = getProductBadge(product);
        const rating = getProductRating(product);
        return `
      <article class="variant-card" style="--delay: ${index * 45}ms;">
        <div class="variant-media">
          <span class="variant-flavor-badge variant-flavor-badge--${badge.key}">${badge.label}</span>
          <span class="variant-rating-badge">⭐ ${rating.score} · ${rating.ratingsCount}</span>
          <img src="${product.image}" alt="MerryMi Liquidy ${product.name}" loading="lazy" />
        </div>
        <div class="variant-card-body">
          <h3><span class="variant-emoji">${getProductEmoji(product)}</span>${product.name}</h3>
          <div class="variant-actions">
            <a class="buy-btn" href="${externalShopUrl}" target="_blank" rel="noopener noreferrer">Kup Teraz</a>
            <a
              class="cart-btn"
              href="#cartSheet"
              data-product-index="${products.indexOf(product)}"
              aria-label="Przejdź do sklepu i dodaj do koszyka"
            >
              <span class="cart-btn-emoji">🛒</span>
            </a>
          </div>
        </div>
      </article>
    `;
      }
    )
    .join('');
}

renderTabs();
renderProducts();
renderRatingsSection();
renderStructuredData();

function scrollToHashTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  const offset = (topbar?.offsetHeight || 0) + 8;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.classList.contains('cart-btn')) return;

    const hash = link.getAttribute('href');
    if (!hash) return;
    event.preventDefault();

    if (document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }

    scrollToHashTarget(hash);
    history.replaceState(null, '', hash);
  });
});

footerFlavorLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const nextCategory = link.dataset.category;
    if (!nextCategory || nextCategory === activeCategory) return;

    activeCategory = nextCategory;
    const activeTab = tabsConfig.find((tab) => tab.id === activeCategory);
    flavorNote.textContent = activeTab?.note || 'Warianty MerryMi Liquidy.';
    renderTabs();
    renderProducts();
  });
});
