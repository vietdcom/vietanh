// Đây là hàm khởi tạo của lớp cameraParameters với ba tham số: distance (khoảng cách từ camera đến đối tượng), 
// safeDistance (khoảng cách an toàn), và body (tên của đối tượng mục tiêu).
var cameraParameters = function (distance, safeDistance, body) {
    // this.theta và this.phi: Đây là hai thuộc tính theta và phi của đối tượng cameraParameters, 
    // được khởi tạo với giá trị mặc định lần lượt là 0.2 và 0.3 tương ứng. Chúng được sử dụng để định hướng camera.
    this.theta = 0.2;
    this.phi = 0.3;
    // Các thuộc tính khác của đối tượng cameraParameters, được khởi tạo với các giá trị được truyền vào 
    // từ tham số của hàm khởi tạo. distance và safeDistance lưu trữ khoảng cách từ camera đến đối tượng và 
    // khoảng cách an toàn tương ứng. safeFar là một giá trị khoảng cách xa tới vô cùng an toàn. 
    // body lưu trữ tên của đối tượng mục tiêu.
    this.distance = distance;
    this.safeDistance = safeDistance;
    this.safeFar = 1e6;
    this.body = body;
    // Đây là khởi tạo một đối tượng camera (THREE.PerspectiveCamera) với các tham số như góc nhìn (45 độ), 
    // tỉ lệ khung hình (aspect ratio) dựa trên kích thước cửa sổ trình duyệt (window.innerWidth / window.innerHeight), 
    // và khoảng cách gần và xa (0.4 và 1e7).
    // this.camera = new 
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.4, 1e7);
};
// Đây là một phương thức getDistance() được thêm vào nguyên mẫu (prototype) của cameraParameters. 
// Nó trả về giá trị của thuộc tính distance.
cameraParameters.prototype.getDistance = function () {
    return this.distance;
};
// Biến getCenterX trả về tọa độ X của tâm chế độ xem của camera. 
// Việc triển khai phương thức này phụ thuộc vào thuộc tính body của đối tượng cameraParameters.
cameraParameters.prototype.getCenterX = function () {
     // Kiểm tra nếu this.body là "Comet". 
    if (this.body == "Comet")
        // Trả về tọa độ X của điểm xoay của "Comet"
        // truy cập đối tượng CelestialBodies và truy xuất "Comet", 
        // sau đó truy cập cometPivot của nó và truy xuất vị trí của nó. 
        // getComponent(0) được gọi trên thuộc tính vị trí để truy xuất tọa độ X.
        return celestialBodies["Comet"].cometPivot.position.getComponent(0);
    // Kiểm tra nếu this.body là bất kỳ giá trị nào khác.
    else
        // trả về tọa độ X của tâm của hành tinh đã chỉ định 
        // truy cập đối tượng CelestialBodies và truy xuất hành tinh có cùng tên với this.body
        // gọi getX() trên hành tinh đó để lấy tọa độ X của nó.
        return celestialBodies[this.body].getX();
};
cameraParameters.prototype.getCenterY = function () {
    if (this.body == "Comet")
        return celestialBodies["Comet"].cometPivot.position.getComponent(1);
    else
        return celestialBodies[this.body].getY();
};
cameraParameters.prototype.getCenterZ = function () {
    if (this.body == "Comet")
        return celestialBodies["Comet"].cometPivot.position.getComponent(2);
    else
        return celestialBodies[this.body].getZ();
};
// centerX - (bodyRadius + distance) * cos(theta) * cos(phi)
// centerY - (bodyRadius + distance) * cos(phi)
// centerZ - (bodyRadius + distance) * cos(theta) * cos(phi)
cameraParameters.prototype.getX = function () {
    return this.getCenterX() - (celestialBodies[this.body].getRadius() + this.distance) * Math.cos(this.theta) * Math.cos(this.phi);
};
cameraParameters.prototype.getZ = function () {
    return this.getCenterZ() - (celestialBodies[this.body].getRadius() + this.distance) * Math.sin(this.theta) * Math.cos(this.phi);
};
cameraParameters.prototype.getY = function () {
    return this.getCenterY() - (celestialBodies[this.body].getRadius() + this.distance) * Math.sin(this.phi);
};
// Đây là phương thức setCamera() được thêm vào nguyên mẫu của cameraParameters. 
// Phương thức này được sử dụng để cập nhật vị trí,
// hướng nhìn của camera dựa trên các thông số và    vị trí của đối tượng mục tiêu.
cameraParameters.prototype.setCamera = function () {
    // Cập nhật tọa độ X của camera bằng cách gọi phương thức getX(), 
    // tính toán tọa độ dựa trên thông số và vị trí của đối tượng mục tiêu.
    this.camera.position.x = this.getX();
    // Cập nhật tọa độ Y của camera bằng cách gọi phương thức getY(), 
    this.camera.position.y = this.getY();
    // Cập nhật tọa độ Z của camera bằng cách gọi phương thức getZ(), 
    this.camera.position.z = this.getZ();
    // Đặt hướng nhìn của camera đến trung tâm của đối tượng mục tiêu bằng cách sử dụng phương thức lookAt(), 
    // với các tham số là tọa độ X, Y, Z của trung tâm đối tượng mục tiêu.
    this.camera.lookAt(this.getCenterX(), this.getCenterY(), this.getCenterZ());
};