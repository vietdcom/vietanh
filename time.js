// Biến globalTimeFlag được khởi tạo với giá trị là true. Đây là một cờ hiệu để kiểm soát việc cập nhật thời gian toàn cục.
var globalTimeFlag = true;

var globalTime = {
    // Đại diện cho thời gian tuyệt đối, được tính bằng mili giây kể từ khi bắt đầu chương trình.
    absolute: 0,
    // Đại diện cho thời gian tương đối, được tính bằng mili giây từ khi bắt đầu chương trình và có thể bị ảnh hưởng bởi scale.
    relative: 0,
    // Đại diện cho tỉ lệ tự động tăng của thời gian tương đối. Mặc định là 1.0.
    scale: 1.,
    // Phương thức getAbsolute() và getRelative() trả về giá trị của thuộc tính tương ứng trong globalTime.
    getAbsolute: function () { return this.absolute; },
    getRelative: function () { return this.relative; }
};

// Tạo một bước lặp trong khoảng thời gian 10 mili giây. Trong bước lặp, kiểm tra nếu globalTimeFlag là true, 
// nghĩa là việc cập nhật thời gian đang được cho phép
window.setInterval(function () {
    if (globalTimeFlag) {
        // giá trị của globalTime.relative tăng lên 0.001 lần globalTime.scale. Điều này tương đương với tăng thời 
        // gian tương đối 0.001 mili giây và có thể điều chỉnh bởi scale.
        globalTime.relative += 0.001 * globalTime.scale;
        // giá trị của globalTime.absolute tăng lên 0.001 mili giây. Điều này tương ứng với tăng thời gian 
        // tuyệt đối 0.001 mili giây kể từ khi bắt đầu chương trình.
        globalTime.absolute += 0.001;
    }
}, 10);

// đoạn mã này cho phép quản lý thời gian toàn cục trong chương trình.