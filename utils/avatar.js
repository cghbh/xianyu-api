// 默认的头像配置,注册的时候随机分配给用户，如果用户需要修改的话自己上传即可
const avatars = [
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_8bbbf72bf9d9cc616314cfb946938982.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_d5ffc37e5268f07ce94c1e7c560fa2f9.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_9e0fd6c3561b6379bc6b5a22cae7bc93.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_63492d3cbcfa0d728c6b1dd3b61c5738.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_f273b508999ae54a457eb66a8622e562.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_664a22d6e9b5d8107a13baf9dc00150a.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_16fb2e0535051d9daa6eed3e371b6367.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6b7207cfdf59f25c6fa31b38924ab6bc.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_61eb8b72fb04494d05e7b14418e46005.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_a9f59c448add1aeafd3768a2037522db.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_a9acf91c30920ab5cbf7b834d08e813d.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_24c6f9f03fcf6cfbf5da5056188a2c23.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_3f79459145556f08cf653f82f1aab532.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5a994af5525225f208a18a1dca8f9679.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_1afe6a46a762796568a6221c2a9f623e.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_310b85c3772b542254e11c200a9dbe03.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_2aaff9583a0768a352a187d50d9ec44d.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_883ecf667067fc9e05a7965b31167624.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_e0986a763762053f581e53595a20ed7b.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5b52050b8ce85233684ed3f5d505a63a.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_221fd94e8667634c0ad184dcc426d594.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5beee7448772f3e7e62c93c92f7300cb.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_a8f9d9baa6d7fe3b1816c6532e0de4c1.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_e711746cc298b983986f5352ea551164.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_1896dd965f59210c37302119a14a4801.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_86728359a110962b2e554ae2d8456aa1.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_daf478451f89b1acc9bf4225b154e73d.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_04b5b96981b3a80d0091dc13b8b6a370.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_daa8c6f00752b208925964f812798eae.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_9361b0d2d2df1828dce3204e2f930cab.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_d270db8dd30ee80fb1c171ad6af155f6.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_51281b48dd1e26fe26e0382178927956.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_ac3662e572467198f7cfec5515c78851.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6a3a6d838eb325b33159705d75f815e6.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_2bfca105755ffe8d147a10def807a4c4.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_2d210adb9abe624252e41ee362d242fd.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_bdd1b90ae26634fb4cad4b7a8f060ec7.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_c928b624886391ffe15c7cc27f4a83a9.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_7a326620f9e5ebdbcc3f237a5802bfb8.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_2c195b777bd36493c9867c33bee44ca4.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6df2103fdb84e4d3593477dafc0a46ca.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_c583f265f745333b137714c12a357e28.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_cf168b6ba0a07a5a947c8e96c6e9fbf2.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_af822980deb0558cbb2132d7b30e037e.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_c9fbfd6d46f6376cac30ec9fb654334c.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_ba32ff1190ec49e13fe22a43b708f45c.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_45183cdb506aa2eb2b04a42ab6d347ba.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_065d6f54efe89490abcdfa860df94767.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_8310f530de890e3e0b02cd1f7a34ba32.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_e4a3d2d37c2b1daa659efbef2485ce02.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_092621f488da7f766bff25df6c818ced.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_d1a24e49f95d51d30b5d580c247cb69c.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_1368e4e2fc105748cfd03eecbeb4b006.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_fd28a8c57788d99ae16805fa83775a4c.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6e594f38e59db1a9adf76d79e815d7bb.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_8c597c47ab2b35e6e1b90b8c06b9aa6e.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_f3bffaf4868b6a265ceefd41348ef782.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6a923a6e796852e56b0cbbadb29080a5.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_95937e41fbee0c3c249b525371e81c04.jpeg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_1695710cd7d829a2273b7284c3f32446.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_023587f755e227a2169a8dd374289119.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_29c70e8db1098678038b256dc5a7cadf.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_d6a3b566dd0b43d0bf275914b3ebbc6a.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_3fe6a94f9daf49c8ee6d4ea585104e47.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_ea306234cfc0f815cd2605e70b6b8133.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5c515a95c16984a7a3d5025b66bf628f.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_65f34cde97c0397b9460205beeb18a0b.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5403c2e578c7d60797fc7315057d83ee.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_ef1cfcefb0c157ba890a7cd67a8042b0.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6935d3595736cce6919826f8521eb0dd.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_3ba2fa5af3926b6831548d8f685030a3.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_b6ff380df0d6bfd195fab8ea57bf8ecc.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_344ae29b98d1fedcc71b7040bfbe467d.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_580b29cf4964bd51952f9611cf553cd7.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_12f9e572621da51306430fae453d0416.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_3bb4994d3833469b39163466773262db.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_c71a2b42932ea6a0eb81a068b62245a3.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_78647374aa9e13fdabd93994577941b8.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_837150a09fe467b87cf04d3d2647c2d2.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_73ffedbbf77e733d3069b71fffbffdb6.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_64ff4109dc691597ee3d52764a5075fe.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_38e7cae0dd3ed247748b2905cadbc758.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_65cdd4ced081eb2dd44696ed89a6fe46.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_e0e2a4b57375efd5f02ba9dc6d5f0ca1.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_a0bb74015c06c70ce62d8a1cfd953388.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_bbabee91408957eaf9fcc76fd696a9ad.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_c8549a3b5db1c090423f8b8a2ebf3444.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_7d6007814ec2f4720bb4a0f5903c1ca7.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5fdbe49c3733efd2361ea48572d00c61.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_bc8d9a5aa17b3ca0a2c89663988b23fb.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_01343faab816876925353168bf9523ab.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_1c2c32c236bc9eca93c80924ade3bc8c.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_94e0bb271620bd18a4016f09193d96f0.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_6296372f2aad6fbf5ab5849e2e5a5119.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_5a426bc3aa3982ee3f61b53c2b436fdf.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_fde2ea08d2a6d4c582fc08182510db0c.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_b6f6297e33fb9f6471dc78d3faaa116b.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_e968bbb69bfb47d4b825f9476b6569df.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_4c0e3d30b2d45fcb17d4e04959530686.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_defee4c2816a571127b7653d424f3c4e.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_8c53537cf74f16c0071a9d86fdd0f799.jpg",
  "https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_d780ecf4eabf551f4b9f22c9448c19ae.jpg"
]

module.exports = avatars