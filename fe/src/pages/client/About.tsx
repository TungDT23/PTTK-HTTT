import { Award, BookOpen, Clock, Heart, MapPin, Phone, ShieldCheck, Star, Users } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-16 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            📚 Về Chúng Tôi
          </h1>
          <p className="text-xl text-amber-50 max-w-3xl mx-auto leading-relaxed">
            Nhà Sách & Văn Phòng Phẩm - Nơi khơi nguồn tri thức, 
            truyền cảm hứng sáng tạo và đồng hành cùng sự thành công của bạn
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-amber-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl">
            <BookOpen className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">Câu Chuyện Của Chúng Tôi</h2>
        </div>
        <div className="space-y-4 text-amber-800 leading-relaxed">
          <p>
            Được thành lập từ năm 2010, <strong>Nhà Sách & Văn Phòng Phẩm</strong> bắt đầu với một 
            ước mơ giản dị: mang tri thức đến gần hơn với mọi người. Từ một cửa hàng nhỏ với vài 
            trăm đầu sách, chúng tôi đã không ngừng phát triển để trở thành địa chỉ tin cậy của 
            hàng ngàn độc giả và khách hàng trên khắp cả nước.
          </p>
          <p>
            Với hơn <strong>15 năm kinh nghiệm</strong> trong ngành, chúng tôi tự hào là đối tác 
            của các nhà xuất bản lớn trong và ngoài nước, đồng thời là nơi cung cấp đa dạng các 
            sản phẩm văn phòng phẩm chất lượng cao phục vụ nhu cầu học tập và làm việc.
          </p>
          <p>
            Sứ mệnh của chúng tôi không chỉ là bán sách và văn phòng phẩm, mà là 
            <strong> xây dựng cộng đồng yêu tri thức</strong>, nơi mọi người có thể tìm thấy 
            nguồn cảm hứng, chia sẻ đam mê đọc sách và học hỏi không ngừng.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div>
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-8">
          🌟 Giá Trị Cốt Lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Chất Lượng</h3>
            <p className="text-amber-700 text-sm">
              100% sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Tận Tâm</h3>
            <p className="text-amber-700 text-sm">
              Phục vụ khách hàng với sự nhiệt tình và chuyên nghiệp nhất
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Star className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Uy Tín</h3>
            <p className="text-amber-700 text-sm">
              Được hàng ngàn khách hàng tin tưởng và đánh giá cao
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Đổi Mới</h3>
            <p className="text-amber-700 text-sm">
              Luôn cập nhật xu hướng và công nghệ mới nhất
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-8">
          📊 Thành Tựu Của Chúng Tôi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-900 mb-2">15+</div>
            <p className="text-amber-700 font-semibold">Năm Kinh Nghiệm</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-900 mb-2">50K+</div>
            <p className="text-amber-700 font-semibold">Khách Hàng</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-900 mb-2">10K+</div>
            <p className="text-amber-700 font-semibold">Đầu Sách</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-900 mb-2">99%</div>
            <p className="text-amber-700 font-semibold">Hài Lòng</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-amber-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl">
            <Users className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">Tại Sao Chọn Chúng Tôi?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-xl p-3 h-fit">
              <BookOpen className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Đa Dạng Sản Phẩm</h3>
              <p className="text-amber-700 text-sm">
                Hơn 10,000 đầu sách và hàng ngàn sản phẩm văn phòng phẩm từ các thương hiệu uy tín
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-xl p-3 h-fit">
              <ShieldCheck className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Chính Hãng 100%</h3>
              <p className="text-amber-700 text-sm">
                Cam kết tất cả sản phẩm đều chính hãng, có tem chống hàng giả và bảo hành đầy đủ
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-xl p-3 h-fit">
              <Clock className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Giao Hàng Nhanh</h3>
              <p className="text-amber-700 text-sm">
                Giao hàng toàn quốc trong 2-3 ngày, miễn phí ship cho đơn hàng từ 500.000đ
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-xl p-3 h-fit">
              <Award className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Ưu Đãi Hấp Dẫn</h3>
              <p className="text-amber-700 text-sm">
                Chương trình khuyến mãi liên tục, tích điểm đổi quà và nhiều ưu đãi thành viên
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-8">📞 Liên Hệ Với Chúng Tôi</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} />
            </div>
            <h3 className="font-bold mb-2 text-lg">Địa Chỉ</h3>
            <p className="text-amber-50 text-sm">
              123 Đường Nguyễn Huệ<br/>
              Quận 1, TP. Hồ Chí Minh
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={28} />
            </div>
            <h3 className="font-bold mb-2 text-lg">Hotline</h3>
            <p className="text-amber-50 text-sm">
              1900 xxxx<br/>
              (8:00 - 21:00 hàng ngày)
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={28} />
            </div>
            <h3 className="font-bold mb-2 text-lg">Giờ Làm Việc</h3>
            <p className="text-amber-50 text-sm">
              Thứ 2 - Chủ Nhật<br/>
              8:00 - 21:00
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          🎉 Tham Gia Cùng Chúng Tôi
        </h2>
        <p className="text-amber-700 mb-6 max-w-2xl mx-auto">
          Khám phá thế giới tri thức và sáng tạo cùng hàng ngàn sản phẩm chất lượng. 
          Đăng ký thành viên ngay hôm nay để nhận ưu đãi đặc biệt!
        </p>
        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg">
          Khám Phá Ngay →
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
