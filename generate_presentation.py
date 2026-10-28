import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]  # Blank slide

    # Color Palette
    COLOR_BG = RGBColor(11, 19, 43)        # #0B132B Very deep navy
    COLOR_CARD = RGBColor(28, 37, 65)      # #1C2541 Slate card
    COLOR_CARD_ALT = RGBColor(20, 27, 48)  # Slightly darker card
    COLOR_CODE_BG = RGBColor(15, 23, 42)   # #0F172A Code terminal dark
    COLOR_BORDER = RGBColor(58, 80, 107)   # #3A506B Subtle border
    
    COLOR_PRIMARY = RGBColor(76, 201, 240) # #4CC9F0 Electric Cyan
    COLOR_ACCENT = RGBColor(247, 37, 133)  # #F72585 Vibrant Magenta/Pink
    COLOR_GOLD = RGBColor(251, 191, 36)    # #FBBF24 Amber Gold
    COLOR_GREEN = RGBColor(52, 211, 153)   # #34D399 Mint Green
    
    COLOR_TEXT_WHITE = RGBColor(255, 255, 255)
    COLOR_TEXT_LIGHT = RGBColor(226, 232, 240)
    COLOR_TEXT_MUTED = RGBColor(148, 163, 184)
    COLOR_TEXT_CODE = RGBColor(186, 230, 253)

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.color.rgb = COLOR_BG
        return bg

    def add_header(slide, badge_text, title_text, category_text="ANDROID STUDIO & JAVA İLE MOBİL GELİŞTİRME"):
        # Top accent bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = COLOR_PRIMARY
        bar.line.fill.background()

        # Category / Course text
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(8.5), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY
        p_cat.font.name = "Segoe UI"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(9.5), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_WHITE
        p_title.font.name = "Segoe UI"

        # Badge (Right side)
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.6), Inches(0.45), Inches(1.9), Inches(0.45))
        badge.fill.solid()
        badge.fill.fore_color.rgb = COLOR_CARD
        badge.line.color.rgb = COLOR_PRIMARY
        badge.line.width = Pt(1.2)
        tf_b = badge.text_frame
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = badge_text
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = COLOR_PRIMARY
        p_b.font.name = "Segoe UI"

    def create_card(slide, left, top, width, height, title, title_color=COLOR_PRIMARY, bg_color=COLOR_CARD, border_color=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)

        if title:
            # Title bar inside card
            t_box = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.4))
            tf = t_box.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = title_color
            p.font.name = "Segoe UI"

        return card

    # =========================================================================
    # SLIDE 1: KAPAK (Title Slide)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative accent line & glow box
    top_glow = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    top_glow.fill.solid()
    top_glow.fill.fore_color.rgb = COLOR_PRIMARY
    top_glow.line.fill.background()

    # Big Title Box
    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.6), Inches(10.9), Inches(2.2))
    tf = t_box.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = "MOBİL UYGULAMA GELİŞTİRME • ANDROID STUDIO"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PRIMARY
    p0.font.name = "Segoe UI"
    p0.space_after = Pt(12)

    p1 = tf.add_paragraph()
    p1.text = "Modern Giriş (Login) Ekranı Mimarisi"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_WHITE
    p1.font.name = "Segoe UI"
    p1.space_after = Pt(10)

    p2 = tf.add_paragraph()
    p2.text = "XML ile Nesne Tabanlı Arayüz Tasarımı & Java ile Olay Yönetimi"
    p2.font.size = Pt(18)
    p2.font.color.rgb = COLOR_GOLD
    p2.font.name = "Segoe UI"

    # 4 Feature Pills on Title Slide
    features = [
        ("📐 ConstraintLayout", "Düz ve esnek kısıtlama mimarisi"),
        ("🎨 Material Components", "TextInputLayout & MaterialButton"),
        ("☕ Java & ViewBinding", "findById, olay dinleme & intent"),
        ("🛡️ Form Doğrulama", "Email/şifre kontrolü ve kullanıcı deneyimi")
    ]
    card_w = 2.5
    start_x = 1.2
    for i, (title, desc) in enumerate(features):
        cx = start_x + (i * 2.8)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(4.3), Inches(2.6), Inches(1.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_PRIMARY if i == 0 else COLOR_BORDER
        c.line.width = Pt(1.2)
        
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.2)
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        
        cp0 = ctf.paragraphs[0]
        cp0.text = title
        cp0.font.size = Pt(13)
        cp0.font.bold = True
        cp0.font.color.rgb = COLOR_PRIMARY
        cp0.font.name = "Segoe UI"
        cp0.space_after = Pt(6)
        
        cp1 = ctf.add_paragraph()
        cp1.text = desc
        cp1.font.size = Pt(10.5)
        cp1.font.color.rgb = COLOR_TEXT_LIGHT
        cp1.font.name = "Segoe UI"

    # Bottom Presenter Footer
    foot = s1.shapes.add_textbox(Inches(1.2), Inches(6.5), Inches(10.9), Inches(0.5))
    ftf = foot.text_frame
    fp = ftf.paragraphs[0]
    fp.text = "Torbalı Piri Reis MTAL Bilişim Teknolojileri Alanı | 11. ve 12. Sınıf Ders Sunumu"
    fp.font.size = Pt(11)
    fp.font.color.rgb = COLOR_TEXT_MUTED
    fp.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 2: DERSİN HEDEFLERİ VE KAZANIMLAR
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "KAZANIMLAR", "Dersin Hedefleri & Öğrenci Kazanımları")

    # Left Card: XML & UI
    create_card(s2, 0.8, 1.4, 5.7, 4.4, "🎨 1. XML Arayüz Tasarımı Kazanımları", COLOR_PRIMARY)
    c1_box = s2.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.2), Inches(3.5))
    tf1 = c1_box.text_frame
    tf1.word_wrap = True
    items1 = [
        ("ConstraintLayout Mantığı:", "Tüm ekran bileşenlerini dikey ve yatay eksenlerde kısıtlayarak (constraints) esnek konumlandırma."),
        ("Material Components Kullanımı:", "Klasik EditText yerine modern TextInputLayout ve MaterialButton nesnelerini projeye entegre etme."),
        ("Ölçü Birimleri (dp vs sp):", "Ekran yoğunluğundan bağımsız piksel (dp) ile ölçeklenebilir yazı birimi (sp) ayrımını kavrama."),
        ("Şifre Güvenlik Arayüzü:", "endIconMode=\"password_toggle\" ile tek satırda şifre gizleme/gösterme butonunu aktif etme."),
        ("Kaynak Yönetimi (Resources):", "Sabit metinleri strings.xml, renkleri colors.xml içinde tutarak temiz kod standardı sağlama.")
    ]
    for i, (head, body) in enumerate(items1):
        p = tf1.add_paragraph() if i > 0 else tf1.paragraphs[0]
        p.text = f"• {head} "
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = body
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # Right Card: Java & Logic
    create_card(s2, 6.8, 1.4, 5.7, 4.4, "☕ 2. Java Kodlama & Olay Yönetimi Kazanımları", COLOR_GREEN)
    c2_box = s2.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.2), Inches(3.5))
    tf2 = c2_box.text_frame
    tf2.word_wrap = True
    items2 = [
        ("Görsel Nesneleri Tanımlama:", "findViewById veya ViewBinding kullanarak XML'deki nesneleri Java sınıflarına bağlama."),
        ("Tıklama Olayları (Listener):", "MaterialButton ve TextView nesnelerine setOnClickListener ile tıklama aksiyonu kazandırma."),
        ("Form Doğrulama (Validation):", "E-posta formatını Patterns.EMAIL_ADDRESS ile, şifreyi uzunluk kuralıyla kontrol etme."),
        ("Dinamik Hata Bildirimi:", "Hatalı girişte TextInputLayout.setError() ile kullanıcıya anlık görsel hata sunma."),
        ("Sayfalar Arası Geçiş (Intent):", "Başarılı girişte DashboardActivity veya kayıt ekranına Intent ile yönlendirme yapma.")
    ]
    for i, (head, body) in enumerate(items2):
        p = tf2.add_paragraph() if i > 0 else tf2.paragraphs[0]
        p.text = f"• {head} "
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = body
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # Bottom Banner
    bb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.9))
    bb.fill.solid()
    bb.fill.fore_color.rgb = COLOR_CARD_ALT
    bb.line.color.rgb = COLOR_GOLD
    bb.line.width = Pt(1)
    bbtf = bb.text_frame
    bbtf.margin_top = Inches(0.18)
    bbtf.margin_left = Inches(0.3)
    bbp = bbtf.paragraphs[0]
    bbp.text = "💡 Pedagojik Not: Bu ders, öğrencilere sadece XML çizmeyi değil; bir mobil arayüzün arkasındaki nesne yönelimli Java mimarisini, kullanıcı deneyimi (UX) standartlarını ve veri doğrulama mantığını kazandırmayı amaçlar."
    bbp.font.size = Pt(11)
    bbp.font.color.rgb = COLOR_TEXT_WHITE
    bbp.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 3: BİLEŞEN HARİTASI VE EKRAN ŞEMASI
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "ANATOMİ", "Ekran Mimarisi ve Bileşen Hiyerarşisi")

    # Left: Mockup Structure (visual tree representation)
    create_card(s3, 0.8, 1.4, 4.2, 5.5, "📱 Ekran Bileşen Katmanları", COLOR_GOLD)
    m_box = s3.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(3.8), Inches(4.7))
    mtf = m_box.text_frame
    mtf.word_wrap = True
    tree_lines = [
        ("Kök Kapsayıcı:", "ConstraintLayout (padding: 24dp)"),
        ("1. Başlık Alanı:", "tvTitle (28sp, Bold)"),
        ("2. Alt Başlık:", "tvSubtitle (14sp, Secondary)"),
        ("3. E-Posta Kutusu:", "tilEmail (TextInputLayout Outlined)"),
        ("   └─ Metin Girdisi:", "etEmail (TextInputEditText: email)"),
        ("4. Şifre Kutusu:", "tilPassword (password_toggle)"),
        ("   └─ Şifre Girdisi:", "etPassword (TextInputEditText: pass)"),
        ("5. Şifremi Unuttum:", "tvForgotPassword (Sağa yaslı TextView)"),
        ("6. Giriş Butonu:", "btnLogin (MaterialButton: 56dp)"),
        ("7. Kayıt Ol Linki:", "tvRegisterPrompt (En altta ortalı)")
    ]
    for i, (l_title, l_desc) in enumerate(tree_lines):
        p = mtf.add_paragraph() if i > 0 else mtf.paragraphs[0]
        p.text = f"{l_title} "
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY if "til" in l_title or "btn" in l_title else COLOR_TEXT_LIGHT
        p.font.name = "Consolas"
        p.space_after = Pt(3)
        run = p.add_run()
        run.text = l_desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # Right: 3 Key Architecture Cards
    cards_data = [
        ("1. Hiyerarşik Olmayan Düz Ağaç (Flat View)", "ConstraintLayout sayesinde iç içe (nested) LinearLayout kullanımına gerek kalmaz. Bu durum ekranın GPU ve işlemci tarafından çok daha hızlı çizilmesini (render) sağlar. Android performans kılavuzlarında 1 numaralı öneridir.", COLOR_PRIMARY),
        ("2. Kısıtlama Zincirleri (Constraint Flow)", "Her nesnenin üstü (top), bir önceki nesnenin altına (bottom) bağlanarak yukarıdan aşağıya kusursuz bir düşey akış zinciri oluşturulmuştur. Kayıt ol promptu ise doğrudan parent tabanına kilitlenmiştir.", COLOR_GREEN),
        ("3. Material Design 3 Standartları", "Form alanları düz çizgilerden kurtulmuş; 12dp ovallikte modern Outlined çerçeveler, yüzen etiketler ve yerleşik şifre göz ikonu ile endüstri standardı UX elde edilmiştir.", COLOR_ACCENT)
    ]
    for i, (ct, cd, col) in enumerate(cards_data):
        top_y = 1.4 + (i * 1.85)
        create_card(s3, 5.3, top_y, 7.2, 1.7, ct, col)
        c_box = s3.shapes.add_textbox(Inches(5.55), Inches(top_y + 0.55), Inches(6.7), Inches(1.05))
        ctf = c_box.text_frame
        ctf.word_wrap = True
        cp = ctf.paragraphs[0]
        cp.text = cd
        cp.font.size = Pt(11.5)
        cp.font.color.rgb = COLOR_TEXT_LIGHT
        cp.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 4: KÖK KAPSAYICI - CONSTRAINTLAYOUT
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "ROOT LAYOUT", "Kök Kapsayıcı: ConstraintLayout İncelemesi")

    # Left: Code Block
    create_card(s4, 0.8, 1.4, 5.7, 5.5, "💻 XML Kök Tanımı", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    code_box = s4.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = code_box.text_frame
    ctf.word_wrap = True
    xml_code = (
        '<androidx.constraintlayout.widget.ConstraintLayout\n'
        '    xmlns:android="http://schemas.android.com/apk/res/android"\n'
        '    xmlns:app="http://schemas.android.com/apk/res-auto"\n'
        '    xmlns:tools="http://schemas.android.com/tools"\n'
        '    android:id="@+id/main"\n'
        '    android:layout_width="match_parent"\n'
        '    android:layout_height="match_parent"\n'
        '    android:background="@color/background_light"\n'
        '    android:padding="24dp"\n'
        '    tools:context=".MainActivity">\n\n'
        '    <!-- Çocuk Görünümler (Views) Buraya Gelir -->\n\n'
        '</androidx.constraintlayout.widget.ConstraintLayout>'
    )
    cp = ctf.paragraphs[0]
    cp.text = xml_code
    cp.font.size = Pt(11)
    cp.font.color.rgb = COLOR_TEXT_CODE
    cp.font.name = "Consolas"

    # Right: Technical Analysis
    create_card(s4, 6.8, 1.4, 5.7, 5.5, "🔍 Özniteliklerin (Attributes) Rolü", COLOR_GOLD)
    exp_box = s4.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    etf = exp_box.text_frame
    etf.word_wrap = True
    attrs = [
        ("xmlns:android & xmlns:app", "XML isim alanlarıdır (namespaces). 'android' çekirdek sistemi, 'app' ise harici Material ve Constraint kütüphanelerini temsil eder."),
        ("android:layout_width & height", "'match_parent' değeri verilerek bu kapsayıcının cihaz ekranının tamamını (en ve boy) kaplaması sağlanır."),
        ("android:padding=\"24dp\"", "Ekranın 4 kenarından (sağ, sol, üst, alt) içerideki nesnelere 24dp iç boşluk verir. Bileşenlerin ekran camına yapışmasını engeller."),
        ("android:background", "Projenin colors.xml dosyasındaki 'background_light' rengini arka plan olarak uygular."),
        ("tools:context=\".MainActivity\"", "Tasarım anında (Design preview) Android Studio'ya bu XML dosyasının hangi Java sınıfına bağlı olduğunu söyler. Çalışma anında (runtime) yok sayılır.")
    ]
    for i, (at_name, at_desc) in enumerate(attrs):
        p = etf.add_paragraph() if i > 0 else etf.paragraphs[0]
        p.text = f"▶ {at_name}:\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(5)
        run = p.add_run()
        run.text = at_desc + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 5: BAŞLIK VE ALT BAŞLIK (TextView)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "TEXTVIEW", "Başlık ve Alt Başlık: TextView Bileşenleri")

    create_card(s5, 0.8, 1.4, 5.7, 5.5, "💻 tvTitle & tvSubtitle XML Kodu", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s5.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    tv_code = (
        '<TextView\n'
        '    android:id="@+id/tvTitle"\n'
        '    android:layout_width="0dp"\n'
        '    android:layout_height="wrap_content"\n'
        '    android:layout_marginTop="48dp"\n'
        '    android:text="@string/login_title"\n'
        '    android:textColor="@color/text_primary"\n'
        '    android:textSize="28sp"\n'
        '    android:textStyle="bold"\n'
        '    app:layout_constraintEnd_toEndOf="parent"\n'
        '    app:layout_constraintStart_toStartOf="parent"\n'
        '    app:layout_constraintTop_toTopOf="parent" />\n\n'
        '<TextView\n'
        '    android:id="@+id/tvSubtitle"\n'
        '    android:layout_width="0dp"\n'
        '    android:layout_height="wrap_content"\n'
        '    android:layout_marginTop="8dp"\n'
        '    android:text="@string/login_subtitle"\n'
        '    android:textColor="@color/text_secondary"\n'
        '    android:textSize="14sp"\n'
        '    app:layout_constraintTop_toBottomOf="@id/tvTitle" ... />'
    )
    p = ctf.paragraphs[0]
    p.text = tv_code
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s5, 6.8, 1.4, 5.7, 5.5, "🎓 Derste Vurgulanacak Kritik Konular", COLOR_GOLD)
    t_box = s5.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    concepts = [
        ("Neden layout_width=\"0dp\"? (MATCH_CONSTRAINT)", "ConstraintLayout'ta 0dp 'Genişlik yok' demek DEĞİLDİR! 'Kısıtlandığım iki kenar arasındaki alanı tamamen doldur' (Match Constraint) demektir. Parent'ın sağına ve soluna bağlandığı için tüm satırı kaplar."),
        ("sp vs dp Farkı Nedir?", "Metin boyutlarında (textSize) MUTLAKA 'sp' kullanılır. Çünkü görme engelli veya yaşlı bir kullanıcı telefon ayarlarından fontu büyüttüğünde 'sp' oransal büyür, 'dp' ise sabit kalır."),
        ("layout_constraintTop_toBottomOf Önemi:", "tvSubtitle nesnesinin üstü (top), tvTitle nesnesinin altına (bottom) bağlanmıştır. Böylece başlık 1 satır da olsa 2 satır da olsa alt başlık asla üstüne binmez, 8dp mesafeyle takip eder."),
        ("Java Karşılığı:", "TextView tvTitle = findViewById(R.id.tvTitle);\ntvTitle.setText(\"Tekrar Hoş Geldiniz!\");")
    ]
    for i, (cn, cd) in enumerate(concepts):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"★ {cn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_GREEN if "Java" in cn else COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = cd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 6: TEXTINPUTLAYOUT (tilEmail)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "MATERIAL DESIGN", "Modern Metin Girdisi: TextInputLayout (tilEmail)")

    create_card(s6, 0.8, 1.4, 5.7, 5.5, "💻 tilEmail XML Kapsayıcısı", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s6.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    til_code = (
        '<com.google.android.material.textfield.TextInputLayout\n'
        '    android:id="@+id/tilEmail"\n'
        '    style="@style/Widget.MaterialComponents\n'
        '           .TextInputLayout.OutlinedBox"\n'
        '    android:layout_width="0dp"\n'
        '    android:layout_height="wrap_content"\n'
        '    android:layout_marginTop="32dp"\n'
        '    android:hint="@string/email_hint"\n'
        '    app:boxCornerRadiusBottomEnd="12dp"\n'
        '    app:boxCornerRadiusBottomStart="12dp"\n'
        '    app:boxCornerRadiusTopEnd="12dp"\n'
        '    app:boxCornerRadiusTopStart="12dp"\n'
        '    app:layout_constraintEnd_toEndOf="parent"\n'
        '    app:layout_constraintStart_toStartOf="parent"\n'
        '    app:layout_constraintTop_toBottomOf="@id/tvSubtitle">\n\n'
        '    <!-- İçeride TextInputEditText yer alır -->\n'
        '</com.google.android.material.textfield.TextInputLayout>'
    )
    p = ctf.paragraphs[0]
    p.text = til_code
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s6, 6.8, 1.4, 5.7, 5.5, "🌟 Neden Klasik EditText Değil?", COLOR_ACCENT)
    t_box = s6.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    features_til = [
        ("Floating Hint (Yüzen İpucu):", "Kullanıcı kutuya tıkladığında veya yazı yazmaya başladığında 'E-posta' yazısı kaybolmaz; yukarı çizginin üzerine taşınarak küçük bir etikete dönüşür. Kullanıcı ne doldurduğunu unutmaz."),
        ("OutlinedBox Stili:", "Düz eski alt çizgi yerine modern 4 kenarlı çerçeve oluşturur."),
        ("12dp Köşe Yuvarlama (Corner Radius):", "4 köşeye de 12dp ovallik verilerek yumuşak ve modern bir UI estetiği kazandırılmıştır."),
        ("Dinamik Hata Desteği (setError):", "Java'dan tek satırla hata mesajı gösterilebilir. Kutu otomatik kırmızı renge bürünür ve altına açıklama metni yerleşir:\n\nTextInputLayout tilEmail = findViewById(R.id.tilEmail);\ntilEmail.setError(\"Geçersiz e-posta formatı!\");")
    ]
    for i, (fn, fd) in enumerate(features_til):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"✔ {fn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY if "Hata" not in fn else COLOR_ACCENT
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = fd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 7: TEXTINPUTEDITTEXT (etEmail)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "INPUT FIELD", "Girdi Alanı: TextInputEditText (etEmail)")

    create_card(s7, 0.8, 1.4, 5.7, 5.5, "💻 etEmail XML Bileşeni", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s7.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    et_code = (
        '    <com.google.android.material.textfield\n'
        '        .TextInputEditText\n'
        '        android:id="@+id/etEmail"\n'
        '        android:layout_width="match_parent"\n'
        '        android:layout_height="wrap_content"\n'
        '        android:inputType="textEmailAddress"\n'
        '        android:maxLines="1" />\n\n'
        '// Java Tarafında Değer Okuma:\n'
        'TextInputEditText etEmail = findViewById(R.id.etEmail);\n'
        'String email = etEmail.getText().toString().trim();'
    )
    p = ctf.paragraphs[0]
    p.text = et_code
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s7, 6.8, 1.4, 5.7, 5.5, "⚙️ Girdi Özellikleri ve Davranışı", COLOR_GREEN)
    t_box = s7.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    et_points = [
        ("inputType=\"textEmailAddress\" Nedir?", "Android işletim sistemine kullanıcının e-posta gireceğini bildirir. Bu sayede açılan klavyede boşluk tuşunun hemen yanına '@' ve '.com' tuşları otomatik yerleşir. Kullanıcı sembol aramak zorunda kalmaz."),
        ("maxLines=\"1\" Kısıtlaması:", "Kullanıcının Enter tuşuna basarak e-posta alanını 2-3 satıra uzatmasını engeller. Formun estetiğini ve tek satırlık düzenini garanti altına alır."),
        ("trim() Metodunun Önemi (Java):", "Kullanıcılar e-postayı kopyala-yapıştır yaparken veya klavye otomatik tamamlarken sona boşluk (' ') karakteri ekleyebilir. trim() metodu bu görünmez boşlukları temizler ve login hatalarını önler."),
        ("Hiyerarşi Kuralı:", "TextInputEditText, doğrudan ConstraintLayout'a değil; her zaman TextInputLayout kapsayıcısının içine çocuk (child) nesne olarak yazılmalıdır.")
    ]
    for i, (pn, pd) in enumerate(et_points):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"🔹 {pn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = pd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 8: ŞİFRE ALANI VE PASSWORD TOGGLE (tilPassword)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "GÜVENLİK & UX", "Şifre Alanı ve Göz İkonu (tilPassword & etPassword)")

    create_card(s8, 0.8, 1.4, 5.7, 5.5, "💻 tilPassword XML Kodu", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s8.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    pw_code = (
        '<com.google.android.material.textfield.TextInputLayout\n'
        '    android:id="@+id/tilPassword"\n'
        '    style="@style/Widget.MaterialComponents\n'
        '           .TextInputLayout.OutlinedBox"\n'
        '    android:layout_width="0dp"\n'
        '    android:layout_height="wrap_content"\n'
        '    android:layout_marginTop="16dp"\n'
        '    android:hint="@string/password_hint"\n'
        '    app:boxCornerRadiusBottomEnd="12dp"\n'
        '    ...\n'
        '    app:endIconMode="password_toggle"\n'
        '    app:layout_constraintTop_toBottomOf="@id/tilEmail">\n\n'
        '    <com.google.android.material.textfield\n'
        '        .TextInputEditText\n'
        '        android:id="@+id/etPassword"\n'
        '        android:layout_width="match_parent"\n'
        '        android:layout_height="wrap_content"\n'
        '        android:inputType="textPassword"\n'
        '        android:maxLines="1" />\n\n'
        '</com.google.android.material.textfield.TextInputLayout>'
    )
    p = ctf.paragraphs[0]
    p.text = pw_code
    p.font.size = Pt(9.5)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s8, 6.8, 1.4, 5.7, 5.5, "👁️ endIconMode=\"password_toggle\" Sihri", COLOR_ACCENT)
    t_box = s8.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    pw_features = [
        ("Sıfır Java Koduyla Göz İkonu!", "Eskiden Android'de şifreyi göster/gizle yapmak için Java tarafında onlarca satır dokunma dinleyicisi (OnTouchListener) ve TransformationMethod yazmak gerekiyordu. Material Design ile yalnızca endIconMode=\"password_toggle\" eklemek yeterlidir."),
        ("inputType=\"textPassword\" Rolü:", "Kullanıcının yazdığı karakterleri anında maskeler (siyah noktalara dönüştürür). Omuz üstünden bakarak şifre çalınmasını engeller."),
        ("Konumlandırma Kısıtı:", "app:layout_constraintTop_toBottomOf=\"@id/tilEmail\" kullanılarak e-posta kutusunun tam 16dp altına kilitlenmiştir."),
        ("Erişilebilirlik (Accessibility):", "Göz ikonuna tıklandığında ekran okuyucular (TalkBack) otomatik olarak 'şifre gizlendi' veya 'şifre gösterildi' sesli uyarısını verir.")
    ]
    for i, (pwn, pwd) in enumerate(pw_features):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"★ {pwn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD if "Sıfır" in pwn else COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = pwd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 9: ŞİFREMİ UNUTTUM & KAYIT OL (TextView Aksiyonları)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "AKSİYONLAR", "Şifremi Unuttum & Kayıt Ol Yönlendirmeleri")

    # Left: tvForgotPassword
    create_card(s9, 0.8, 1.4, 5.7, 5.5, "🔗 tvForgotPassword (Sağa Yaslı Link)", COLOR_PRIMARY)
    l_box = s9.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ltf = l_box.text_frame
    ltf.word_wrap = True
    l_points = [
        ("XML Kodu:", "<TextView\n    android:id=\"@+id/tvForgotPassword\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:layout_marginTop=\"12dp\"\n    android:clickable=\"true\"\n    android:focusable=\"true\"\n    android:text=\"@string/forgot_password\"\n    android:textColor=\"@color/primary\"\n    app:layout_constraintEnd_toEndOf=\"parent\"\n    app:layout_constraintTop_toBottomOf=\"@id/tilPassword\" />"),
        ("clickable=\"true\" ve focusable=\"true\":", "Bir TextView'i buton gibi davranır hale getirir. Tıklama animasyonu (ripple) kazanır ve klavye/kumanda ile odaklanabilir."),
        ("Sağa Yaslama Tekniği:", "app:layout_constraintEnd_toEndOf=\"parent\" kısıtı verilerek şifre kutusunun bittiği sağ hizaya çekilmiştir.")
    ]
    for i, (head, body) in enumerate(l_points):
        p = ltf.add_paragraph() if i > 0 else ltf.paragraphs[0]
        p.text = f"▶ {head}\n"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD
        p.font.name = "Segoe UI"
        p.space_after = Pt(3)
        run = p.add_run()
        run.text = body + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_CODE if "XML" in head else COLOR_TEXT_LIGHT
        run.font.name = "Consolas" if "XML" in head else "Segoe UI"

    # Right: tvRegisterPrompt
    create_card(s9, 6.8, 1.4, 5.7, 5.5, "⚓ tvRegisterPrompt (Tabana Sabit Link)", COLOR_GREEN)
    r_box = s9.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    rtf = r_box.text_frame
    rtf.word_wrap = True
    r_points = [
        ("XML Kodu:", "<TextView\n    android:id=\"@+id/tvRegisterPrompt\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:layout_marginBottom=\"16dp\"\n    android:padding=\"8dp\"\n    android:clickable=\"true\"\n    android:focusable=\"true\"\n    android:textColor=\"@color/primary\"\n    app:layout_constraintBottom_toBottomOf=\"parent\"\n    app:layout_constraintEnd_toEndOf=\"parent\"\n    app:layout_constraintStart_toStartOf=\"parent\" />"),
        ("Tabana Kilitleme Mantığı:", "app:layout_constraintBottom_toBottomOf=\"parent\" kullanılarak cihazın ekran boyutu ne olursa olsun (küçük telefon veya tablet) ekranın en altına raptiyelenmiştir."),
        ("Yatayda Ortalama Formülü:", "Hem Start hem End parent'a bağlandığında nesne tam yatay merkeze (center) yerleşir."),
        ("android:padding=\"8dp\" UX Kuralı:", "Küçük metinlerin parmakla tıklanması zordur. 8dp iç boşluk görünmez bir dokunma alanı (touch target) açarak kullanıcının rahatça basmasını sağlar.")
    ]
    for i, (head, body) in enumerate(r_points):
        p = rtf.add_paragraph() if i > 0 else rtf.paragraphs[0]
        p.text = f"✔ {head}\n"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(3)
        run = p.add_run()
        run.text = body + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_CODE if "XML" in head else COLOR_TEXT_LIGHT
        run.font.name = "Consolas" if "XML" in head else "Segoe UI"

    # =========================================================================
    # SLIDE 10: ANA AKSİYON BUTONU: MATERIALBUTTON (btnLogin)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "BUTON BİLEŞENİ", "Ana Eylem Butonu: MaterialButton (btnLogin)")

    create_card(s10, 0.8, 1.4, 5.7, 5.5, "💻 btnLogin XML Tanımı", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s10.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    btn_code = (
        '<com.google.android.material.button.MaterialButton\n'
        '    android:id="@+id/btnLogin"\n'
        '    android:layout_width="0dp"\n'
        '    android:layout_height="56dp"\n'
        '    android:layout_marginTop="24dp"\n'
        '    android:backgroundTint="@color/primary"\n'
        '    android:text="@string/login_button"\n'
        '    android:textAllCaps="false"\n'
        '    android:textColor="@color/white"\n'
        '    android:textSize="16sp"\n'
        '    android:textStyle="bold"\n'
        '    app:cornerRadius="12dp"\n'
        '    app:layout_constraintEnd_toEndOf="parent"\n'
        '    app:layout_constraintStart_toStartOf="parent"\n'
        '    app:layout_constraintTop_toBottomOf="@id/tvForgotPassword" />'
    )
    p = ctf.paragraphs[0]
    p.text = btn_code
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s10, 6.8, 1.4, 5.7, 5.5, "🎯 Profesyonel Buton Tasarım Kuralları", COLOR_GOLD)
    t_box = s10.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    btn_notes = [
        ("Neden 56dp Yükseklik?", "Google Material Design standartlarına göre birincil eylem (Primary CTA) butonları için önerilen dokunma yüksekliği 48dp - 56dp arasındadır. Kullanıcı yürürken veya tek elle telefonu tutarken rahatça basabilir."),
        ("android:textAllCaps=\"false\" Neden Şart?", "Eski Android butonları yazılan metni otomatik olarak BÜYÜK HARFE ('GİRİŞ YAP') çevirir. 'false' yapılarak metnin tasarlandığı gibi ('Giriş Yap') çıkması sağlanır."),
        ("app:cornerRadius=\"12dp\":", "Butona harici bir drawable XML şekli (shape) oluşturmaya gerek kalmadan doğrudan köşe ovalliği verir. Formdaki input kutularının (12dp) ovalliği ile mükemmel bir görsel uyum yakalar."),
        ("backgroundTint vs background:", "MaterialButton bileşeninde arka plan rengini değiştirmek için klasik 'background' yerine MUTLAKA 'backgroundTint' kullanılır. Aksi halde gölge ve dalga efektleri bozulabilir.")
    ]
    for i, (bn, bd) in enumerate(btn_notes):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"★ {bn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = bd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 11: JAVA MİMARİSİ (MainActivity.java)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "JAVA PROGRAMLAMA", "Java Mimarisi: Nesneleri Tanımlama & Bağlama")

    create_card(s11, 0.8, 1.4, 6.5, 5.5, "💻 MainActivity.java - Temel Yapı", COLOR_GREEN, bg_color=COLOR_CODE_BG)
    c_box = s11.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(6.0), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    java_skel = (
        'public class MainActivity extends AppCompatActivity {\n\n'
        '    // 1. XML Nesnelerinin Java Değişkenleri\n'
        '    private TextInputLayout tilEmail, tilPassword;\n'
        '    private TextInputEditText etEmail, etPassword;\n'
        '    private MaterialButton btnLogin;\n'
        '    private TextView tvForgotPassword, tvRegisterPrompt;\n\n'
        '    @Override\n'
        '    protected void onCreate(Bundle savedInstanceState) {\n'
        '        super.onCreate(savedInstanceState);\n'
        '        setContentView(R.layout.activity_main);\n\n'
        '        // 2. XML ile Java Nesnelerini Eşleştirme (Binding)\n'
        '        initViews();\n'
        '        setupListeners();\n'
        '    }\n\n'
        '    private void initViews() {\n'
        '        tilEmail = findViewById(R.id.tilEmail);\n'
        '        tilPassword = findViewById(R.id.tilPassword);\n'
        '        etEmail = findViewById(R.id.etEmail);\n'
        '        etPassword = findViewById(R.id.etPassword);\n'
        '        btnLogin = findViewById(R.id.btnLogin);\n'
        '        tvForgotPassword = findViewById(R.id.tvForgotPassword);\n'
        '        tvRegisterPrompt = findViewById(R.id.tvRegisterPrompt);\n'
        '    }\n'
        '}'
    )
    p = ctf.paragraphs[0]
    p.text = java_skel
    p.font.size = Pt(9.5)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s11, 7.6, 1.4, 4.9, 5.5, "🎓 Kod Analizi & İpuçları", COLOR_GOLD)
    t_box = s11.shapes.add_textbox(Inches(7.85), Inches(2.05), Inches(4.4), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    j_tips = [
        ("setContentView(R.layout.activity_main):", "Java sınıfına 'senin görsel yüzün bu XML dosyasıdır' diyen köprü fonksiyondur. Bu çağrılmadan findViewById çalıştırılırsa uygulama çöker (NullPointerException)."),
        ("initViews() Metodu Ayırma:", "Tüm findViewById satırlarını doğrudan onCreate içine yığmak yerine ayrı bir metoda almak temiz kod (Clean Code) disiplinidir."),
        ("Modern Alternatif: ViewBinding", "findViewById her çağrıldığında ekran ağacını baştan tarar. Android Studio'da ViewBinding açılarak ActivityMainBinding nesnesiyle %100 tip güvenli ve sıfır findViewById ile çalışılabilir.")
    ]
    for i, (jn, jd) in enumerate(j_tips):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"★ {jn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = jd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 12: JAVA İLE FORM DOĞRULAMA (VALIDATION)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "FORM KONTROLÜ", "Java ile Veri Doğrulama (Validation Mantığı)")

    create_card(s12, 0.8, 1.4, 6.5, 5.5, "💻 Doğrulama & Hata Gösterme Kodu", COLOR_ACCENT, bg_color=COLOR_CODE_BG)
    c_box = s12.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(6.0), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    val_code = (
        'private boolean validateForm() {\n'
        '    String email = etEmail.getText().toString().trim();\n'
        '    String password = etPassword.getText().toString().trim();\n'
        '    boolean isValid = true;\n\n'
        '    // 1. E-posta Kontrolleri\n'
        '    if (TextUtils.isEmpty(email)) {\n'
        '        tilEmail.setError("E-posta adresi boş bırakılamaz!");\n'
        '        isValid = false;\n'
        '    } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {\n'
        '        tilEmail.setError("Lütfen geçerli bir e-posta giriniz!");\n'
        '        isValid = false;\n'
        '    } else {\n'
        '        tilEmail.setError(null); // Hatayı temizle\n'
        '    }\n\n'
        '    // 2. Şifre Kontrolleri\n'
        '    if (TextUtils.isEmpty(password)) {\n'
        '        tilPassword.setError("Şifre boş bırakılamaz!");\n'
        '        isValid = false;\n'
        '    } else if (password.length() < 6) {\n'
        '        tilPassword.setError("Şifre en az 6 karakter olmalıdır!");\n'
        '        isValid = false;\n'
        '    } else {\n'
        '        tilPassword.setError(null);\n'
        '    }\n'
        '    return isValid;\n'
        '}'
    )
    p = ctf.paragraphs[0]
    p.text = val_code
    p.font.size = Pt(9.2)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s12, 7.6, 1.4, 4.9, 5.5, "🛡️ Güvenlik ve Mantık Açıklaması", COLOR_GOLD)
    t_box = s12.shapes.add_textbox(Inches(7.85), Inches(2.05), Inches(4.4), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    v_points = [
        ("Patterns.EMAIL_ADDRESS Sihri:", "Android SDK içinde hazır gelen Regex desenidir. İçinde '@' ve geçerli alan adı (örn: .com, .k12.tr) olup olmadığını karmaşık regex yazmadan doğrular."),
        ("TextUtils.isEmpty():", "Girdinin 'null' veya uzunluğunun 0 olup olmadığını tek hamlede güvenle kontrol eder."),
        ("setError(null) Önemi:", "Öğrencilerin en çok atladığı yerdir! Kullanıcı hatasını düzeltip tekrar butona bastığında eski hata uyarısını kaldırmak için 'setError(null)' çağrılmalıdır."),
        ("Sunucuya Boş İstek Gitmez:", "validateForm() false dönerse API veya backend servisine gereksiz internet isteği atılmaz; internet kotası ve sunucu yükü korunur.")
    ]
    for i, (vn, vd) in enumerate(v_points):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"✔ {vn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = vd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 13: OLAY YÖNETİMİ & INTENT İLE SAYFA GEÇİŞİ
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, "NAVİGASYON & TOAST", "Olay Yönetimi (Listeners) & Sayfa Geçişi (Intent)")

    create_card(s13, 0.8, 1.4, 6.5, 5.5, "💻 setupListeners() ve Intent Kodları", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    c_box = s13.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(6.0), Inches(4.7))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    int_code = (
        'private void setupListeners() {\n'
        '    // Giriş Butonuna Tıklanması\n'
        '    btnLogin.setOnClickListener(v -> {\n'
        '        if (validateForm()) {\n'
        '            Toast.makeText(this, "Giriş Başarılı!", Toast.LENGTH_SHORT).show();\n\n'
        '            // Ana Ekrana Geçiş (Intent)\n'
        '            Intent intent = new Intent(MainActivity.this, DashboardActivity.class);\n'
        '            startActivity(intent);\n'
        '            finish(); // Geri tuşuyla tekrar login ekranına dönülmesin\n'
        '        }\n'
        '    });\n\n'
        '    // Şifremi Unuttum Tıklanması\n'
        '    tvForgotPassword.setOnClickListener(v -> {\n'
        '        Intent intent = new Intent(MainActivity.this, ForgotPasswordActivity.class);\n'
        '        startActivity(intent);\n'
        '    });\n\n'
        '    // Kayıt Ol Tıklanması\n'
        '    tvRegisterPrompt.setOnClickListener(v -> {\n'
        '        Intent intent = new Intent(MainActivity.this, RegisterActivity.class);\n'
        '        startActivity(intent);\n'
        '    });\n'
        '}'
    )
    p = ctf.paragraphs[0]
    p.text = int_code
    p.font.size = Pt(9.2)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    create_card(s13, 7.6, 1.4, 4.9, 5.5, "🚀 Kritik Android Kavramları", COLOR_GREEN)
    t_box = s13.shapes.add_textbox(Inches(7.85), Inches(2.05), Inches(4.4), Inches(4.7))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    nav_concepts = [
        ("Intent Nedir?", "Android'de bileşenler (Activity'ler) arasında köprü kuran 'Niyet/Amaç' nesnesidir. 'Şu anki ekrandan (MainActivity) hedef ekrana (DashboardActivity) git' talimatını verir."),
        ("Neden finish() Çağrılır?", "Kullanıcı başarıyla giriş yaptıktan sonra ana ekranda Android'in fiziksel 'Geri' tuşuna bastığında tekrar Login ekranını görmemelidir. finish() metodu Login Activity'yi bellek yığınından (Back Stack) tamamen siler."),
        ("Lambda Gösterimi (v -> { ... }):", "Java 8 ile gelen pratik sözdizimidir. 'new View.OnClickListener()' kalıbını kısaltarak kodun okunabilirliğini artırır."),
        ("Toast Bildirimi:", "Kullanıcıya ekranın altında kaybolan hafif geri bildirim balonu gösterir.")
    ]
    for i, (nn, nd) in enumerate(nav_concepts):
        p = ttf.add_paragraph() if i > 0 else ttf.paragraphs[0]
        p.text = f"★ {nn}\n"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = nd + "\n"
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 14: GEREKLİ KAYNAK DOSYALARI (strings.xml & colors.xml)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, "RESOURCES", "Gerekli Kaynak Dosyaları (strings.xml & colors.xml)")

    # Left: strings.xml
    create_card(s14, 0.8, 1.4, 5.7, 5.5, "📄 res/values/strings.xml", COLOR_PRIMARY, bg_color=COLOR_CODE_BG)
    s_box = s14.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.7))
    stf = s_box.text_frame
    stf.word_wrap = True
    str_code = (
        '<resources>\n'
        '    <string name="app_name">Piri Reis Portal</string>\n'
        '    <string name="login_title">Giriş Yap</string>\n'
        '    <string name="login_subtitle">Hesabınıza erişmek için bilgilerinizi giriniz</string>\n'
        '    <string name="email_hint">E-posta Adresi</string>\n'
        '    <string name="password_hint">Şifre</string>\n'
        '    <string name="forgot_password">Şifremi Unuttum?</string>\n'
        '    <string name="login_button">Giriş Yap</string>\n'
        '    <string name="register_prompt">Hesabınız yok mu? Kayıt Olun</string>\n'
        '</resources>\n\n'
        '💡 Avantaj: Uygulama İngilizceye çevrilmek istendiğinde values-en/strings.xml oluşturmak yeterlidir. XML koduna dokunulmaz!'
    )
    p = stf.paragraphs[0]
    p.text = str_code
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    # Right: colors.xml
    create_card(s14, 6.8, 1.4, 5.7, 5.5, "🎨 res/values/colors.xml", COLOR_GOLD, bg_color=COLOR_CODE_BG)
    col_box = s14.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(5.2), Inches(4.7))
    ctf = col_box.text_frame
    ctf.word_wrap = True
    col_code = (
        '<resources>\n'
        '    <!-- Ana Marka Renkleri -->\n'
        '    <color name="primary">#1E40AF</color> <!-- Koyu Mavi -->\n'
        '    <color name="primary_dark">#1E3A8A</color>\n'
        '    <color name="accent">#0284C7</color>\n\n'
        '    <!-- Arka Plan ve Yüzeyler -->\n'
        '    <color name="background_light">#F8FAFC</color>\n'
        '    <color name="white">#FFFFFF</color>\n\n'
        '    <!-- Metin Renkleri -->\n'
        '    <color name="text_primary">#0F172A</color> <!-- Koyu Gri/Siyah -->\n'
        '    <color name="text_secondary">#64748B</color> <!-- Soluk Gri -->\n'
        '</resources>\n\n'
        '💡 Avantaj: Renk paleti merkezi yönetilir. Marka rengi değiştiğinde tek satırda tüm uygulama yenilenir.'
    )
    p = ctf.paragraphs[0]
    p.text = col_code
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_CODE
    p.font.name = "Consolas"

    # =========================================================================
    # SLIDE 15: ÖĞRETMEN NOTLARI & SIK YAPILAN ÖĞRENCİ HATALARI
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, "EĞİTMEN REHBERİ", "Sık Yapılan Öğrenci Hataları & Sınıf İçi Görevler")

    # 3 Cards Layout
    card_w = 3.65
    tips_data = [
        ("⚠️ 1. En Sık Yapılan Hatalar", [
            ("Kısıtlama Vermeyi Unutmak:", "Öğrenci nesneyi ekrana koyar ama kısıtlamaz. Android Studio'da düzgün görünür fakat emülatörde çalışınca sol üst köşeye (0,0) yığılır."),
            ("Klavye Açılınca Taşma:", "Küçük telefonlarda klavye açılınca alttaki buton ekranın dışında kalabilir. Çözüm: Ekranın kökünü bir ScrollView içine sarmalamaktır."),
            ("match_parent Hatası:", "ConstraintLayout içinde çocuk nesnelere match_parent verilmemeli; bunun yerine 0dp (match_constraint) kullanılmalıdır.")
        ], COLOR_ACCENT),

        ("💡 2. Öğretmene Ders İçi Taktikler", [
            ("Canlı Hata Yaptırın:", "Derste bilerek bir nesnenin kısıtını silin ve projeyi emülatörde çalıştırın. Öğrencilerin kısıt hatasını gözleriyle görmesini sağlayın."),
            ("Password Toggle Gösterin:", "endIconMode özelliğini kapatıp açarak öğrencilere Material kütüphanesinin sağladığı zaman tasarrufunu hissettirin."),
            ("Toast ile Değer Basın:", "Butona basıldığında girilen e-posta ve şifreyi Toast mesajında göstererek verinin nasıl okunduğunu somutlaştırın.")
        ], COLOR_PRIMARY),

        ("🏆 3. Sınıf İçi Uygulama Görevi", [
            ("Görev 1 (Beni Hatırla):", "Şifre alanının hemen altına 'Beni Hatırla' adında bir CheckBox ekleyip kısıtlamalarını bağlayınız."),
            ("Görev 2 (Sosyal Giriş):", "Giriş butonunun altına 'Google ile Giriş Yap' butonu (Outlined MaterialButton) tasarlayınız."),
            ("Görev 3 (Şifre Kuralı):", "Java tarafında şifrenin en az 1 büyük harf ve 1 rakam içermesi kuralını if bloklarıyla geliştiriniz.")
        ], COLOR_GOLD)
    ]

    for i, (title, points, color) in enumerate(tips_data):
        cx = 0.8 + (i * 4.0)
        create_card(s15, cx, 1.4, card_w, 5.5, title, color)
        t_box = s15.shapes.add_textbox(Inches(cx + 0.2), Inches(2.05), Inches(card_w - 0.4), Inches(4.7))
        ttf = t_box.text_frame
        ttf.word_wrap = True
        for j, (head, body) in enumerate(points):
            p = ttf.add_paragraph() if j > 0 else ttf.paragraphs[0]
            p.text = f"• {head}\n"
            p.font.size = Pt(10.5)
            p.font.bold = True
            p.font.color.rgb = color
            p.font.name = "Segoe UI"
            p.space_after = Pt(3)
            run = p.add_run()
            run.text = body + "\n"
            run.font.bold = False
            run.font.color.rgb = COLOR_TEXT_LIGHT

    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "Android_Studio_Login_Sunumu.pptx"
    create_presentation(out)
