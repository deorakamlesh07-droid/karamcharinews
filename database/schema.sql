CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(320) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  source_name VARCHAR(200),
  source_url TEXT,
  order_number VARCHAR(150),
  issued_on DATE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived'))
);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(status, published_at DESC);

CREATE TABLE IF NOT EXISTS article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
  alt_text VARCHAR(300),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS article_media_article_idx ON article_media(article_id, position);

-- One-time administrator email codes. Codes are HMAC-hashed before storage.
CREATE TABLE IF NOT EXISTS admin_otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) NOT NULL,
  code_hash VARCHAR(64) NOT NULL,
  attempts SMALLINT NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 5),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS admin_otp_challenges_lookup_idx ON admin_otp_challenges(email, created_at DESC);

-- Maintain a vetted list of government pages. An editor should verify each item before publishing.
CREATE TABLE IF NOT EXISTS official_sources (
  id SERIAL PRIMARY KEY,
  authority_name VARCHAR(200) NOT NULL,
  authority_type VARCHAR(80) NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  state_name VARCHAR(120),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 3000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initial public categories and articles. These are safe to run repeatedly.
INSERT INTO categories (name, slug, description) VALUES
  ('ताज़ा खबरें', 'latest-news', 'कर्मचारियों के हालिया अपडेट'),
  ('DA', 'da', 'महंगाई भत्ता अपडेट'),
  ('DPC', 'dpc', 'पदोन्नति समिति अपडेट'),
  ('ACP / MACP', 'acp-macp', 'करियर प्रगति समाचार'),
  ('8वां वेतन आयोग', '8th-pay-commission', 'वेतन आयोग की ताज़ा खबरें'),
  ('वेतन आयोग', 'pay-commission', 'वेतन संशोधन और fitment'),
  ('पेंशन और सेवानिवृत्ति', 'pension-retirement', 'पेंशन से जुड़े विषय'),
  ('योजनाएं और लाभ', 'schemes-benefits', 'कल्याणकारी योजनाएं')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO articles (title, slug, excerpt, content, category_id, source_name, source_url, order_number, issued_on, published_at, status) VALUES
  ('राजस्थान: RAcS अधिकारियों के लिए Review DPC आदेश जारी, AAO-I से Junior Scale (2025-26)', 'rajasthan-racs-review-dpc-aao-junior-scale-2025-26', 'राजस्थान वित्त विभाग की नवीनतम सूची में RAcS अधिकारियों के AAO-I से Junior Scale के लिए Review DPC Order (2025-26) दर्ज है। यह अपडेट संबंधित RAcS कैडर तक सीमित है।', 'यह कैडर-विशिष्ट Review DPC अपडेट है। पात्रता, वरिष्ठता, रिक्ति-वर्ष और व्यक्तिगत पदोन्नति की स्थिति संबंधित विभागीय रिकॉर्ड तथा अंतिम आदेश से तय होगी।', (SELECT id FROM categories WHERE slug = 'dpc'), 'राजस्थान वित्त विभाग', 'https://finance.rajasthan.gov.in/website/Default.aspx/Menu_JS_CSS/Script_Style/scroll/Menu_JS_CSS/ImageSlider/SearchOrders.aspx', NULL, '2026-09-14', '2026-09-14T00:00:00+05:30', 'published'),
  ('8वां वेतन आयोग: 1.98 से 3.83 तक Fitment Factor की चर्चा को समझें', '8th-pay-commission-fitment-factor-range', 'Fitment Factor वेतन संशोधन का एक गुणक है। 1.98 से 3.83 के संभावित दायरे की चर्चा को आधिकारिक घोषणा नहीं समझना चाहिए। अंतिम दर केवल आयोग और सरकार के निर्णय से तय होगी।', 'Fitment Factor वर्तमान basic pay को संशोधित pay structure में बदलने का गुणक है। 1.98 से 3.83 तक की संख्याएं चर्चा या मांग के स्तर पर हैं; इन्हें आधिकारिक दर नहीं माना जाना चाहिए।', (SELECT id FROM categories WHERE slug = '8th-pay-commission'), NULL, NULL, NULL, '2026-11-24', '2026-11-24T00:00:00+05:30', 'published'),
  ('8वें वेतन आयोग पर नई खबर: कर्मचारियों को किन आधिकारिक अपडेट पर नजर रखनी चाहिए', '8th-pay-commission-latest-update', 'आयोग की अधिसूचना, Terms of Reference, सिफारिशें और सरकार के स्वीकृति आदेश ही विश्वसनीय आधार हैं।', 'कर्मचारियों को केवल आयोग की अधिसूचना, Terms of Reference, प्रकाशित सिफारिशों और सरकार के स्वीकृति आदेश पर भरोसा करना चाहिए।', (SELECT id FROM categories WHERE slug = '8th-pay-commission'), NULL, NULL, NULL, '2026-11-24', '2026-11-24T00:00:00+05:30', 'published'),
  ('राजस्थान DA 63%: 1 जुलाई 2026 से लागू, 60% से 3% की बढ़ोतरी', 'rajasthan-da-63-percent-july-2026', 'राजस्थान वित्त विभाग के आदेश सं. F.6(3)FD(Rules)/2017 के अनुसार RCS (Revised Pay) Rules, 2017 के कर्मचारियों का DA 60% से बढ़ाकर 63% किया गया है।', 'राजस्थान वित्त विभाग के अनुसार RCS (Revised Pay) Rules, 2017 के अंतर्गत DA 60 प्रतिशत से बढ़ाकर 63 प्रतिशत किया गया है, जो 1 जुलाई 2026 से प्रभावी है।', (SELECT id FROM categories WHERE slug = 'da'), 'राजस्थान वित्त विभाग (Rules Division)', 'https://finance.rajasthan.gov.in/PDFDOCS/RULES/15248.pdf', 'F.6(3)FD(Rules)/2017', '2026-10-30', '2026-10-30T00:00:00+05:30', 'published'),
  ('DPC प्रक्रिया: कर्मचारियों को कौन-से दस्तावेज तैयार रखने चाहिए', 'department-promotion-committee-guidance', 'DPC से पहले सेवा अभिलेख, पात्रता और विभागीय सत्यापन से जुड़ी व्यावहारिक जानकारी।', 'DPC से पहले कर्मचारियों को अपने सेवा अभिलेख, पात्रता, APAR और विभागीय सत्यापन की स्थिति की जांच करनी चाहिए। अंतिम प्रक्रिया संबंधित सेवा नियमों से तय होगी।', (SELECT id FROM categories WHERE slug = 'dpc'), NULL, NULL, NULL, '2026-11-22', '2026-11-22T00:00:00+05:30', 'published'),
  ('ACP / MACP प्रगति: पात्रता और सेवा अवधि को समझें', 'macp-progression-guidance', 'लागू नियमों और अपने विभागीय सेवा रिकॉर्ड में किन बातों की जांच करें।', 'ACP / MACP से संबंधित लाभ के लिए कर्मचारियों को लागू नियम, नियमित सेवा अवधि और अपने विभागीय सेवा रिकॉर्ड की जांच करनी चाहिए।', (SELECT id FROM categories WHERE slug = 'acp-macp'), NULL, NULL, NULL, '2026-11-21', '2026-11-21T00:00:00+05:30', 'published'),
  ('राजस्थान Revised Pay Rules: Pay Matrix और वेतन निर्धारण को समझें', 'rajasthan-revised-pay-rules-guide', 'Rajasthan Civil Services (Revised Pay) Rules, 2017 के अंतर्गत वेतन निर्धारण, Pay Matrix और विभागीय सत्यापन से संबंधित जरूरी बातें।', 'Rajasthan Civil Services (Revised Pay) Rules, 2017 के अंतर्गत वेतन निर्धारण के लिए लागू Pay Matrix, सेवा विवरण और विभागीय सत्यापन महत्वपूर्ण हैं।', (SELECT id FROM categories WHERE slug = 'pay-commission'), NULL, NULL, NULL, '2026-11-19', '2026-11-19T00:00:00+05:30', 'published')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category_id = EXCLUDED.category_id,
  source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url,
  order_number = EXCLUDED.order_number,
  issued_on = EXCLUDED.issued_on,
  published_at = EXCLUDED.published_at,
  status = EXCLUDED.status,
  updated_at = NOW();
