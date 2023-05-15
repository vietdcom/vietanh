var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mouseStatus = {
    x: 0, y: 0,
    leftDown: false, centerDown: false, rightDown: false
};
// Hàm "onWindowMouseMove" là hàm xử lý sự kiện được gọi khi người dùng di chuyển chuột qua cửa sổ.
function onWindowMouseMove(event) {
    // Keep the value in 0 -- 2 PI
    var body = params.Camera;
    // Nếu nút chuột trái được nhấn (mouseStatus.leftDown == True), 
    // hàm sẽ cập nhật giá trị của theta và phi của 
    // camera trong trackCamera[body] dựa trên sự di chuyển của chuột
    if (mouseStatus.leftDown) {
        // theta và phi được giới hạn trong khoảng từ 0 đến 2π và từ -0.5π đến 0.5π tương ứng.
        trackCamera[body].theta = trackCamera[body].theta % (2 * Math.PI);
        trackCamera[body].phi = trackCamera[body].phi % (0.5 * Math.PI);
        
        trackCamera[body].theta += (event.clientX - windowHalfX - mouseStatus.x) * 0.01;

        if (trackCamera[body].phi - (event.clientY - windowHalfY - mouseStatus.y) * 0.01 >= -0.5 * Math.PI &&
            trackCamera[body].phi - (event.clientY - windowHalfY - mouseStatus.y) * 0.01 <= 0.5 * Math.PI)
            trackCamera[body].phi -= (event.clientY - windowHalfY - mouseStatus.y) * 0.01;
    }
    // Cập nhật tọa độ x và y của chuột trong mouseStatus.
    mouseStatus.x = event.clientX - windowHalfX;
    mouseStatus.y = event.clientY - windowHalfY;
}
// onWindowMouseDown được gọi khi nhấn nút chuột. 
// Hàm lấy một đối tượng sự kiện làm đối số của nó, chứa thông tin về sự kiện đã kích hoạt nó.
function onWindowMouseDown(event) {
    switch (event.which) {
        case 1:
            mouseStatus.leftDown = true;
            break;
        case 2:
            mouseStatus.centerDown = true;
            break;
        case 3:
        default:
            mouseStatus.rightDown = true;
            break;
    }
}
// onWindowMouseUp được gọi khi nút chuột được nhả ra. 
// Hàm lấy một đối tượng sự kiện làm đối số của nó, chứa thông tin về sự kiện đã giải phóng nó.
function onWindowMouseUp(event) {
    switch (event.which) {
        case 1:
            mouseStatus.leftDown = false;
            break;
        case 2:
            mouseStatus.centerDown = false;
            break;
        case 3:
        default:
            mouseStatus.rightDown = false;
            break;
    }
}
// onMouseWheelChange được sử dụng để xử lý sự kiện con lăn chuột. 
// Nó lấy một đối tượng sự kiện làm đối số.
function onMouseWheelChange(event) {
    var body = params.Camera;
    // Hàm tính toán delta dựa trên giá trị event.wheelDelta hoặc event.detail để xác định hướng cuộn chuột.
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    var newDistance = trackCamera[body].distance - 0.05 * trackCamera[body].distance * delta;

    if (newDistance <= trackCamera[body].safeDistance) {
        newDistance = trackCamera[body].safeDistance;
    } else if (newDistance >= trackCamera[body].safeFar) {
        newDistance = trackCamera[body].safeFar;
    }
    // thuộc tính khoảng cách của đối tượng trackCamera được liên kết với phần thân hiện tại 
    // được đặt thành giá trị khoảng cách mới.
    trackCamera[body].distance = newDistance;
}

var posSrc = { pos: 0.0 };
var oX, oY, oZ, dX, dY, dZ, oTheta, dTheta, oPhi, dPhi, oDistance, dDistance, oSafeDis, dSafeDis;
var oCX, oCY, oCZ, dCX, dCY, dCZ;
// Định nghĩa tween (hiệu ứng chuyển động mượt mà) sử dụng thư viện TWEEN.
tween = new TWEEN.Tween(posSrc)
    // Tween này sẽ tạo một chuyển động từ pos ban đầu (0.0) đến pos kết thúc (1.0) trong 4000ms (4 giây).
    .to({ pos: 1.0 }, 4000)
    // Easing được sử dụng để điều chỉnh tốc độ chuyển độ
    .easing(TWEEN.Easing.Quartic.InOut)
    // Khi tween bắt đầu, hàm callback onStart được gọi.
    .onStart(function () {
        // globalTimeFlag được đặt thành false, có thể là một biến kiểm soát thời gian chung trong ứng dụng.
        globalTimeFlag = false;
    })
    // Trong quá trình tween, hàm callback onUpdate được gọi sau mỗi frame.
    .onUpdate(function () {
        // Trong callback này, giá trị pos được lấy từ posSrc.pos, đại diện cho tiến trình tweening từ 0.0 đến 1.0.
        var pos = posSrc.pos;
        // Các thuộc tính của camera trong switchCamera được cập nhật dựa trên giá trị pos, để tạo ra hiệu ứng chuyển động mượt mà.
        switchCamera.camera.position.set(oX + dX * pos, oY + dY * pos, oZ + dZ * pos);
        switchCamera.theta = oTheta + dTheta * pos;
        switchCamera.phi = oPhi + dPhi * pos;
        switchCamera.distance = oDistance + dDistance * pos;
        switchCamera.safeDistance = oSafeDis + dSafeDis * pos;
        switchCamera.camera.lookAt(oCX + dCX * pos, oCY + dCY * pos, oCZ + dCZ * pos);
    })
    // Khi tween hoàn thành, hàm callback onComplete được gọi.
    .onComplete(function () {
        // Nếu goRoaming được đặt thành true, tức là chuyển sang chế độ đi lang thang, 
        // các tham số và camera được thiết lập cho roaming mode (roamingCamera), 
        // và các cài đặt điều khiển camera cũng được đặt.
        if (goRoaming) {
            calculateParams[curBody] = saveCur;
            calculateParams["Earth"] = saveNext;
            renderCamera = roamingCamera;
            cameraControl = new THREE.FirstPersonControls(roamingCamera.camera);
            cameraControl.lookSpeed = 0.1;
            cameraControl.movementSpeed = 150;
            cameraControl.noFly = true;
            cameraControl.constrainVertical = true;
            cameraControl.verticalMin = 1.0;
            cameraControl.verticalMax = 2.0;
            cameraControl.lon = -150;
            cameraControl.lat = 120;
            needSet = false;
            roamingStatus = true;
            goRoaming = false;
            roamingCamera.camera.lookAt(0, 0, 0);
        // Nếu không, các tham số và camera được thiết lập cho chế độ theo dõi (trackCamera), 
        // và các biến và cờ liên quan sẽ được cập nhật
        } else {
            calculateParams[curBody] = saveCur;
            calculateParams[nextBody] = saveNext;
            switchCamera.body = nextBody;
            curBody = nextBody;
            needSet = true;
            renderCamera = trackCamera[nextBody];
        }
        // Đồng bộ hóa hoạt động chung sau khi tween hoàn thành
        globalTimeFlag = true;
    });
// Hàm initTween khởi tạo tween bằng cách đặt các thông số và chế độ máy ảnh bắt đầu
function initTween() {
    // Lưu trữ giá trị hiện tại của calculateParams[curBody] và calculateParams[nextBody] 
    // để khôi phục sau khi tween hoàn thành.
    saveCur = calculateParams[curBody];
    saveNext = calculateParams[nextBody];
    // Tắt tính toán cho curBody và nextBody trong quá trình tween.
    calculateParams[curBody] = false;
    calculateParams[nextBody] = false;
    // Cập nhật camera render thành camera được định nghĩa trong switchCamera.
    renderCamera = switchCamera;
    // Đặt giá trị ban đầu của pos trong quá trình tween là 0.0.
    posSrc.pos = 0.0;
    // Đặt cờ needSet thành false để không cần thiết thiết lập camera trong quá trình tween.
    needSet = false;
}
// Hàm setTween đặt chế độ camera kết thúc và các tham số cho tween
// Hàm này nhận đối số cur và next để thiết lập các giá trị ban đầu và khoảng chênh lệch 
// (delta) cho các thuộc tính trong quá trình tween.
function setTween(cur, next) {
    // Nếu cur là null => không có camera hiện tại, 
    // các giá trị ban đầu được truyền trực tiếp qua các đối số thứ 3, 4 và 5.
    if (cur == null) {
        // oX, oY, oZ: Tọa độ x, y, z ban đầu của camera.
        oX = arguments[2];
        oY = arguments[3];
        oZ = arguments[4];
        // oTheta, oPhi: Góc theta và góc phi ban đầu của camera.
        oTheta = 0.2;
        oPhi = 0.3;
        // Khoảng cách ban đầu từ camera đến điểm nhìn.
        oDistance = 30;
        // Khoảng cách an toàn ban đầu.
        oSafeDis = 30;
        // oCX, oCY, oCZ: Tọa độ x, y, z của điểm nhìn ban đầu của camera roaming.
        oCX = roamingCamera.camera.position.x;
        oCY = roamingCamera.camera.position.y;
        oCZ = roamingCamera.camera.position.z;
    } else {
        oX = trackCamera[cur].getX();
        oY = trackCamera[cur].getY();
        oZ = trackCamera[cur].getZ();
        oTheta = trackCamera[cur].theta;
        oPhi = trackCamera[cur].phi;
        oDistance = trackCamera[cur].distance;
        oSafeDis = trackCamera[cur].safeDistance;
        oCX = trackCamera[cur].getCenterX();
        oCY = trackCamera[cur].getCenterY();
        oCZ = trackCamera[cur].getCenterZ();
    }
    // Nếu next là null => không có camera tiếp theo
    // các giá trị delta được tính toán dựa trên giá trị ban đầu và các đối số truyền vào
    if (next == null) {
        // dCX, dCY, dCZ: Sự chênh lệch (delta) của tọa độ x, y, z của điểm nhìn so với giá trị ban đầu
        // dX, dY, dZ: Sự chênh lệch (delta) của tọa độ x, y, z của camera so với giá trị ban đầu.
        dCX = dX = arguments[2] - oX;
        dCY = dY = arguments[3] - oY;
        dCZ = dZ = arguments[4] - oZ;
        // dTheta, dPhi: Sự chênh lệch (delta) của góc theta và góc phi so với giá trị ban đầu.
        dTheta = 0.2 - oTheta;
        dPhi = 0.3 - oPhi;
        // Sự chênh lệch (delta) của khoảng cách từ camera đến điểm nhìn so với giá trị ban đầu.
        dDistance = 30 - oDistance;
        // Sự chênh lệch (delta) của khoảng cách an toàn so với giá trị ban đầu.
        dSafeDis = 30 - oSafeDis;
    // Nếu next không phải là null, các giá trị delta được tính toán bằng cách lấy sự chênh 
    // lệch giữa giá trị của camera tiếp theo và giá trị ban đầu
    } else {
        // dX, dY, dZ: Sự chênh lệch (delta) của tọa độ x, y, z của camera so với giá trị ban đầu và camera tiếp theo.
        dX = trackCamera[next].getX() - oX;
        dY = trackCamera[next].getY() - oY;
        dZ = trackCamera[next].getZ() - oZ;
        // dCX, dCY, dCZ: Sự chênh lệch (delta) của tọa độ x, y, z của điểm nhìn so với giá trị ban đầu và camera tiếp theo.
        dCX = trackCamera[next].getCenterX() - oCX;
        dCY = trackCamera[next].getCenterY() - oCY;
        dCZ = trackCamera[next].getCenterZ() - oCZ;
        // dTheta, dPhi: Sự chênh lệch (delta) của góc theta và góc phi so với giá trị ban đầu và camera tiếp theo.
        dTheta = trackCamera[next].theta - oTheta;
        dPhi = trackCamera[next].phi - oPhi;
        // tính toán sự chênh lệch giữa khoảng cách (distance) của camera tiếp theo (trackCamera[next].distance) 
        // và khoảng cách hiện tại (oDistance). Kết quả là giá trị chênh lệch (dDistance) giữa hai khoảng cách này.
        dDistance = trackCamera[next].distance - oDistance;
        // tính toán sự chênh lệch giữa khoảng cách an toàn (safeDistance) của camera tiếp theo 
        // (trackCamera[next].safeDistance) và khoảng cách an toàn hiện tại (oSafeDis). 
        // Kết quả là giá trị chênh lệch (dSafeDis) giữa hai khoảng cách an toàn này.
        dSafeDis = trackCamera[next].safeDistance - oSafeDis;
    }
}
// Hàm cameraCopy này nhận hai tham số: cameraDst và cameraSrc.
// Cả hai đều là đối tượng đại diện cho máy ảnh. 
// Hàm sao chép các giá trị theta, phi, distance, safeDistance và body từ cameraSrc sang cameraDst.
// Phương thức setCamera() được gọi trên cameraDst.
function cameraCopy(cameraDst, cameraSrc) {
    cameraDst.theta = cameraSrc.theta;
    cameraDst.phi = cameraSrc.phi;
    cameraDst.distance = cameraSrc.distance;
    cameraDst.safeDistance = cameraSrc.safeDistance;
    cameraDst.body = cameraSrc.body;
    cameraDst.setCamera();
}

