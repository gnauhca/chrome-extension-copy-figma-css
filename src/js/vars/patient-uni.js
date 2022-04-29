export default `
--primary-color: #1f8fff!important; // 品牌色，加 important 是为了覆盖 meui 中用 --primary-color 无前缀变量（me-picker）
--primary-text-color: #1f8fff; // 品牌文字色
// --primary-text-color: #1168bf; // 品牌文字色

--primary-light-bg: #ecf5fe; // 品牌浅背景色

--sub-color: #1f8fff; // 辅色，部分图标
--sub-2-color: #00b8cc; // 辅色 2
--sub-2-light-bg: rgba(0, 184, 129, 0.08); // 辅色 2 浅背景

// button
--btn-height: 88rpx;
--btn-border-radius: 16rpx;
--btn-small-height: 64rpx;
--btn-small-border-radius: 8rpx;

// 空状态
--blank-img-width: 400rpx;
--blank-img-height: 320rpx;
--blank-img-1: url('https://baike-med-1256891581.file.myqcloud.com/2021124/b30ccbb0-53e1-11ec-acc4-2daa03d2616b_0.png');
--blank-img-2: url(https://baike-med-1256891581.file.myqcloud.com/2021077/2519b320-edef-11eb-b727-2966ebe1cd85_0.png); // 如病历空
--blank-img-3: url(https://baike-med-1256891581.file.myqcloud.com/2021079/bddb3130-ede3-11eb-956b-c525d6c0c8cb_0.png); // 如病历空
--blank-img-4: url('https://baike-med-1256891581.file.myqcloud.com/2021124/b30ccbb0-53e1-11ec-acc4-2daa03d2616b_0.png'); // 消息空
--blank-img-1-small:  var(--blank-img-1);
--blank-img-2-small:  var(--blank-img-2);
--blank-img-3-small:  var(--blank-img-3);

--blank-img-5: url('https://baike-med-1256891581.file.myqcloud.com/2021082/f715d220-f8ba-11eb-91d1-3368cd681d02_0.png');
--blank-img-6: url('https://baike-med-1256891581.file.myqcloud.com/2021081/f711da80-f8ba-11eb-91d1-3368cd681d02_0.png');
--blank-img-7: url('https://baike-med-1256891581.file.myqcloud.com/2021082/f7120190-f8ba-11eb-91d1-3368cd681d02_0.png');
--blank-img-8: url('https://baike-med-1256891581.file.myqcloud.com/2021082/f7007560-f8ba-11eb-8e3d-f307aeb71f0d_0.png');


// 默认头像
--avatar-male: url(https://baike-med-1256891581.file.myqcloud.com/2021034/af4e35d0-8c9b-11eb-867e-459973069544_0.png);
--avatar-female: url(https://baike-med-1256891581.file.myqcloud.com/2021032/af4ef920-8c9b-11eb-867e-459973069544_0.png);

// logo
--logo: url(https://baike-med-1256891581.file.myqcloud.com/2020112/bc73cb30-23ff-11eb-8814-d115951e661a_0.png);
--logo-white: url(https://baike-med-1256891581.file.myqcloud.com/2021071/249cd2d0-f0e0-11eb-b727-2966ebe1cd85_0.png);

--logo-circle: url(https://baike-med-1256891581.cos.ap-guangzhou.myqcloud.com/yidian/production/_xcx/patient-uni/common/logo-circle.png);

// 页面背景
// 背景非透明，带纹理
--primary-page-bg: url(https://baike-med-1256891581.file.myqcloud.com/2021074/eabb1d20-eeb3-11eb-b727-2966ebe1cd85_0.jpg);
// 单纯背景纹理，透明
--primary-page-bg-transparent: url(https://baike-med-1256891581.file.myqcloud.com/2021096/df7da2b0-1f6a-11ec-8dbe-ad3f6ba5fe4b_0.png);
// 背景渐变，透明
--primary-page-bg-gradient: linear-gradient(
  180deg,
  #0080ff 0%,
  rgba(0, 128, 255, 0.9) 60.3%,
  rgba(20, 138, 255, 0.7) 78.47%,
  rgba(31, 143, 255, 0.5) 89.19%,
  rgba(31, 143, 255, 0) 100%
);
// 背景渐变，高度为整页，如电子处方页
--primary-fullpage-bg-gradient: linear-gradient(180deg, #1F8FFF 0%, #1F8FFF 18.05%, #72B9FF 28.15%, #F4F5F7 62.98%, #F6F8FA 100%);
`;
