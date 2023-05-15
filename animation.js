// Hàm remain nhận một tham số objKey 
// và kiểm tra xem một đối tượng có tồn tại hay không dựa trên objKey.
function remain(objKey) {
    // Câu lệnh if đầu tiên kiểm tra xem thuộc tính parent của đối tượng celestialBodies[objKey]
    // có giá trị null hay không. Nếu có, nghĩa là đối tượng không có cha mẹ và hàm trả về true.
    if (celestialBodies[objKey].parent == null)
        return true;
    // Nó kiểm tra xem calculateParams có thuộc tính có tên là tên của đối tượng parent và tên của cha mẹ không phải là "Sun".
    // Nó cũng kiểm tra xem calculateParams có thuộc tính có tên là objKey hay không.
    // Nếu một trong hai điều kiện trên đúng, hàm trả về true. Nếu không, hàm trả về false.
    if ((calculateParams[celestialBodies[objKey].parent.name] && celestialBodies[objKey].parent.name != "Sun") ||
        calculateParams[objKey])
        return true;
    return false;
}

// render là 1 chức năng được sử dụng để update, 
// hiển thị các hành tinh và chế độ xem camera 
function render() {
    // Hàm lặp qua từng khóa trong CelestBody 
    // và gọi phương thức cập nhật của hành tinh được liên kết với khóa hiện tại, 
    // chuyển thời gian hiện tại làm đối số
    for (var objKey in celestialBodies) {
        if (firstflag || remain(objKey)) {
            celestialBodies[objKey].update(globalTime.getRelative());
            // Nếu orbitParams có một thuộc tính với khóa hiện tại, 
            // thì hàm sẽ thêm đối tượng quỹ đạo tương ứng vào cảnh. 
            // Nếu không, nó sẽ loại bỏ đối tượng khỏi cảnh.
            if (orbitParams[objKey]) {
                scene.add(orbitDraw[objKey]);
            } else {
                scene.remove(orbitDraw[objKey]);
            }
        }
    }
    // kiểm tra firstflag true hay false
    if (firstflag) {
        
        $(function () {
            // Sử dụng setTimeout để trì hoãn 
            // việc thực thi một hàm trong khoảng thời gian 2 giây.
            setTimeout(function () {
                // Làm mờ phần tử có id là "prompt" trong vòng 500 milliseconds
                $("#prompt").fadeOut(500);
                // Thêm stats.domElement và renderer.domElement vào container.
                container.appendChild(stats.domElement);  
                container.appendChild(renderer.domElement);
                gui.open(); // Mở gui (giao diện người dùng đồ họa).
            }, 2000);
        });
    }
    // Gán giá trị false cho firstflag sau khi hoàn thành việc hiển thị.
    firstflag = false;
    // Nếu needSet là true, 
    //  gọi phương thức setCamera của renderCamera để cài đặt camera.
    if (needSet) {
        renderCamera.setCamera();
    }
    // Sử dụng renderer và 
    // thuộc tính camera của renderCamera để render scene.
    renderer.render(scene, renderCamera.camera);
}