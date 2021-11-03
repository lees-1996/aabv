$(function() {
    //把layui的form表单和弹出框方法导出  自定义一个用户昵称的校验标准
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    initUserInfo()
        // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用form.val()快速为表单赋值 第一值是为谁赋值  第二个是什么值
                form.val('formUserInfo', res.data)
            }
        });
    }

    //    重置表单数据点击时重置  然后调用初始化用户的函数 获取到用户的信息  然后填充
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认重置行为 发起ajax请求
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            // $(this).serialize()意思就是快速的拿到这个表单的值
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                    // 调用父页面的方法，重新渲染用户头像和用户的信息
                window.parent.getUserInfo()
            }

        })

    })
})