# Ebebek Ürün Karuseli Uygulaması

Bu proje, ebebek.com ana sayfasında çalışacak şekilde tasarlanmış, **sadece vanilla JavaScript** kullanılarak yazılmış, responsive bir ürün karuseli uygulamasıdır. Doğrudan **Chrome DevTools Console** üzerinden çalıştırılmak üzere hazırlanmıştır.

## 🔔 Önemli Notlar

1. **Başlık Güncellemesi**  
   PDF dokümanında `"Beğenebileceğinizi düşündüklerimiz"` yazıyordu, ancak ebebek sitesindeki güncel tasarıma uyması adına `"Sizin için Seçtiklerimiz"` başlığı kullanıldı.

2. **Karusel Yerleştirme Mantığı**  
   Karusel şu sıralama ile uygun DOM öğesini arar ve ardından ekler:
   - `.stories-section` (orijinal dökümandaki sınıf)
   - `.stories` (alternatif sınıf)
   - `.Section1` (ebebek’in güncel yapısı)

   Eğer hiçbiri bulunamazsa, `document.body`'nin başına ekler (fallback).

## 🧪 Nasıl Test Edilir?

1. [https://www.e-bebek.com](https://www.e-bebek.com) adresine git
2. Chrome'da geliştirici araçlarını aç (`F12`)
3. **Console** sekmesine geç
4. Tüm JS dosyasını yapıştır ve Enter’a bas
