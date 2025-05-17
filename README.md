# Ebebek Ürün Karuseli Uygulaması

Bu proje, ebebek.com ana sayfasında çalışacak şekilde tasarlanmış, **sadece vanilla JavaScript** kullanılarak yazılmış, responsive bir ürün karuseli uygulamasıdır. Doğrudan **Chrome DevTools Console** üzerinden çalıştırılmak üzere hazırlanmıştır.

## 🔔 Önemli Notlar

1. **Kullanıcı Değerlendirmeleri**  
    PDF dokümanında ve fetch edilen verilerde bu bölüme dair herhangi bir bilgi bulunmadığı için, kullanıcı değerlendirmeleri ve puanlar karusel içinde gösterilmemektedir. Ancak bu özellikler istenildiği takdirde kolaylıkla eklenebilir.

2. **Karusel Yerleştirme Mantığı**  
   Karusel şu sıralama ile uygun DOM öğesini arar ve ardından ekler:
   - `.stories-section` (orijinal dökümandaki sınıf)
   - `.stories` (alternatif sınıf)
   - `.Section1` (ebebek’in güncel yapısı)

   Eğer hiçbiri bulunamazsa, `document.body`'nin başına ekler (fallback).
