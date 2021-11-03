$(function() {


    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            // 纵横比 就是指定裁剪框是什么形状 1就相当于1/1就是正方型的意思
            aspectRatio: 1,
            // 指定预览区域 为类名为'.img-preview'的div
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传的按钮绑定点击事件 当用户点击上传按钮时 就手动让上传文件
    // 的input框选择框被打开
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        // 1.拿到用户选择的图片
        var file = e.target.files[0]
            // 2.将文件 转化为路径
        var newImgURL = URL.createObjectURL(file)
            // 3.重新初始化剪裁区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 为确定按钮 绑定点击事件
    $('#btnUpload').on('click', function() {
        // 1.要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符
            //  base64 格式的图片相比于src路径的图片体积要大30%  适合小图片使用 可以减少请求次数
            // 2.调用接口 把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})