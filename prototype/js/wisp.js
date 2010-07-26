    
    // VAR
    
    // Wisp body
    var body = [
          { method: 'moveTo', 			 data: [0,72.65] },
          { method: 'bezierCurveTo', data: [50.8,75.11,85.62,55.25,85.62,25.42] },
          { method: 'bezierCurveTo', data: [85.62,11.38,74.23,0,60.19,0] },
          { method: 'bezierCurveTo', data: [46.42,0,37.02,11.11,34.51,25.42] },
          { method: 'bezierCurveTo', data: [30.42,48.78,26.47,69.74,0.2,68.47] },
          { method: 'bezierCurveTo', data: [-1.81,72.56,0,72.65,0,72.65] }
        ];
    
    // Eyes open
    var path = [
          { method: 'moveTo', data: [-6.6090,-12.9385] },
          { method: 'bezierCurveTo', data: [-7.0241,-11.9364,-7.6193,-11.0634,-8.3417,-10.3417] },
          { method: 'bezierCurveTo', data: [-9.0904,-9.5935,-9.9758,-9.0078,-10.9385,-8.609] },
          { method: 'bezierCurveTo', data: [-11.9013,-8.2102,-12.9415,-7.9983,-14,-7.9979] },
          { method: 'bezierCurveTo', data: [-15.0211,-7.9975,-16.0593,-8.1939,-17.0615,-8.609] },
          { method: 'bezierCurveTo', data: [-18.0636,-9.0241,-18.9366,-9.6193,-19.6583,-10.3417] },
          { method: 'bezierCurveTo', data: [-20.4065,-11.0904,-20.9922,-11.9758,-21.391,-12.9385] },
          { method: 'bezierCurveTo', data: [-21.7898,-13.9013,-22.0017,-14.9415,-22.0021,-16] },
          { method: 'bezierCurveTo', data: [-22.0025,-17.0211,-21.8061,-18.0593,-21.391,-19.0615] },
          { method: 'bezierCurveTo', data: [-20.9759,-20.0636,-20.3807,-20.9366,-19.6583,-21.6583] },
          { method: 'bezierCurveTo', data: [-18.9096,-22.4065,-18.0242,-22.9922,-17.0615,-23.391] },
          { method: 'bezierCurveTo', data: [-16.0987,-23.7898,-15.0585,-24.0017,-14,-24.0021] },
          { method: 'bezierCurveTo', data: [-12.9789,-24.0025,-11.9407,-23.8061,-10.9385,-23.391] },
          { method: 'bezierCurveTo', data: [-9.9364,-22.9759,-9.0634,-22.3807,-8.3417,-21.6583] },
          { method: 'bezierCurveTo', data: [-7.5935,-20.9096,-7.0078,-20.0242,-6.609,-19.0615] },
          { method: 'bezierCurveTo', data: [-6.2102,-18.0987,-5.9983,-17.0585,-5.9979,-16] },
          { method: 'bezierCurveTo', data: [-5.9975,-14.9789,-6.1939,-13.9407,-6.609,-12.9385] },
          { method: 'moveTo', data: [21.391,-12.9385] },
          { method: 'bezierCurveTo', data: [20.9759,-11.9364,20.3807,-11.0634,19.6583,-10.3417] },
          { method: 'bezierCurveTo', data: [18.9096,-9.5935,18.0242,-9.0078,17.0615,-8.609] },
          { method: 'bezierCurveTo', data: [16.0987,-8.2102,15.0585,-7.9983,14,-7.9979] },
          { method: 'bezierCurveTo', data: [12.9789,-7.9975,11.9407,-8.1939,10.9385,-8.609] },
          { method: 'bezierCurveTo', data: [9.9364,-9.0241,9.0634,-9.6193,8.3417,-10.3417] },
          { method: 'bezierCurveTo', data: [7.5935,-11.0904,7.0078,-11.9758,6.609,-12.9385] },
          { method: 'bezierCurveTo', data: [6.2102,-13.9013,5.9983,-14.9415,5.9979,-16] },
          { method: 'bezierCurveTo', data: [5.9975,-17.0211,6.1939,-18.0593,6.609,-19.0615] },
          { method: 'bezierCurveTo', data: [7.0241,-20.0636,7.6193,-20.9366,8.3417,-21.6583] },
          { method: 'bezierCurveTo', data: [9.0904,-22.4065,9.9758,-22.9922,10.9385,-23.391] },
          { method: 'bezierCurveTo', data: [11.9013,-23.7898,12.9415,-24.0017,14,-24.0021] },
          { method: 'bezierCurveTo', data: [15.0211,-24.0025,16.0593,-23.8061,17.0615,-23.391] },
          { method: 'bezierCurveTo', data: [18.0636,-22.9759,18.9366,-22.3807,19.6583,-21.6583] },
          { method: 'bezierCurveTo', data: [20.4065,-20.9096,20.9922,-20.0242,21.391,-19.0615] },
          { method: 'bezierCurveTo', data: [21.7898,-18.0987,22.0017,-17.0585,22.0021,-16] },
          { method: 'bezierCurveTo', data: [22.0025,-14.9789,21.8061,-13.9407,21.391,-12.9385] }
        ];

    // Eyes evil
    var paths = {
          evil: [
            { method: 'moveTo', data: [-7.8277,-11.8135] },
            { method: 'bezierCurveTo', data: [-8.187,-11.2441,-8.7886,-10.6731,-9.2167,-10.3104] },
            { method: 'bezierCurveTo', data: [-9.7676,-9.8437,-10.7258,-9.5078,-11.4385,-9.3277] },
            { method: 'bezierCurveTo', data: [-12.4489,-9.0725,-13.2227,-8.9671,-14.2812,-8.9667] },
            { method: 'bezierCurveTo', data: [-15.3024,-8.9663,-16.4343,-9.0376,-17.499,-9.3902] },
            { method: 'bezierCurveTo', data: [-18.5287,-9.7312,-19.2491,-10.0881,-19.9083,-10.6229] },
            { method: 'bezierCurveTo', data: [-20.7304,-11.2898,-21.1797,-11.7883,-21.5785,-12.751] },
            { method: 'bezierCurveTo', data: [-21.9773,-13.7138,-22.0954,-14.9415,-22.0958,-16] },
            { method: 'bezierCurveTo', data: [-22.0962,-17.0211,-21.9686,-18.0493,-21.5785,-19.0615] },
            { method: 'bezierCurveTo', data: [-21.1322,-20.2199,-20.0975,-21.9971,-19.9396,-21.8458] },
            { method: 'bezierCurveTo', data: [-19.1055,-21.0471,-18.0242,-20.3047,-17.0927,-19.9223] },
            { method: 'bezierCurveTo', data: [-16.1287,-19.5265,-14.8085,-18.8767,-13.7813,-18.5646] },
            { method: 'bezierCurveTo', data: [-12.8042,-18.2678,-11.4719,-17.8061,-10.3448,-17.5785] },
            { method: 'bezierCurveTo', data: [-9.2815,-17.3638,-8.2541,-17.1016,-7.4979,-17.0333] },
            { method: 'bezierCurveTo', data: [-6.6875,-16.9601,-4.6961,-16.8592,-3.609,-16.8427] },
            { method: 'bezierCurveTo', data: [-3.3809,-16.8393,-6.0052,-14.583,-6.5313,-13.8438] },
            { method: 'bezierCurveTo', data: [-7.0471,-13.1189,-7.3207,-12.6171,-7.8277,-11.8135] },
            { method: 'moveTo', data: [21.6098,-12.8135] },
            { method: 'bezierCurveTo', data: [21.1947,-11.8114,20.8064,-11.2412,19.9708,-10.6542] },
            { method: 'bezierCurveTo', data: [19.1283,-10.0622,18.5555,-9.7265,17.5302,-9.3902] },
            { method: 'bezierCurveTo', data: [16.54,-9.0654,15.7773,-8.9983,14.7188,-8.9979] },
            { method: 'bezierCurveTo', data: [13.6976,-8.9975,13.0032,-9.0064,11.9073,-9.2652] },
            { method: 'bezierCurveTo', data: [10.8516,-9.5146,9.5947,-10.0256,8.8417,-10.6854] },
            { method: 'bezierCurveTo', data: [8.0455,-11.383,7.414,-12.5695,6.8277,-13.5323] },
            { method: 'bezierCurveTo', data: [6.2857,-14.4223,4.6391,-15.8914,3.6229,-16.875] },
            { method: 'bezierCurveTo', data: [3.4144,-17.0768,6.6007,-16.9192,7.6715,-17.0927] },
            { method: 'bezierCurveTo', data: [8.6491,-17.2511,9.6257,-17.4386,10.6229,-17.6583] },
            { method: 'bezierCurveTo', data: [11.4654,-17.844,12.0421,-17.9725,13.0323,-18.2973] },
            { method: 'bezierCurveTo', data: [14.0575,-18.6336,14.8477,-18.9079,15.75,-19.3146] },
            { method: 'bezierCurveTo', data: [16.6809,-19.7342,17.9031,-20.2124,18.5615,-20.6723] },
            { method: 'bezierCurveTo', data: [19.4507,-21.2934,19.9678,-22.1307,20.0958,-21.9396] },
            { method: 'bezierCurveTo', data: [20.685,-21.0602,21.1797,-20.3055,21.5785,-19.3427] },
            { method: 'bezierCurveTo', data: [21.9773,-18.38,22.0017,-17.0585,22.0021,-16] },
            { method: 'bezierCurveTo', data: [22.0025,-14.9789,22.0249,-13.8157,21.6098,-12.8135] }
          ],
          top: [
            { method: 'moveTo', data: [-6.6090,-12.9385] },
            { method: 'bezierCurveTo', data: [-7.0241,-11.9364,-7.6193,-11.0634,-8.3417,-10.3417] },
            { method: 'bezierCurveTo', data: [-9.0904,-9.5935,-9.9758,-9.0078,-10.9385,-8.609] },
            { method: 'bezierCurveTo', data: [-11.9013,-8.2102,-12.9415,-7.9983,-14,-7.9979] },
            { method: 'bezierCurveTo', data: [-15.0211,-7.9975,-16.0593,-8.1939,-17.0615,-8.609] },
            { method: 'bezierCurveTo', data: [-18.0636,-9.0241,-18.9366,-9.6193,-19.6583,-10.3417] },
            { method: 'bezierCurveTo', data: [-20.4065,-11.0904,-20.9922,-11.9758,-21.391,-12.9385] },
            { method: 'bezierCurveTo', data: [-21.7898,-13.9013,-22.0021,-14.9415,-22.0021,-16] },
            { method: 'bezierCurveTo', data: [-22.0021,-16.0524,-21.6811,-15.9968,-21.391,-15.999] },
            { method: 'bezierCurveTo', data: [-20.3063,-16.007,-19.9567,-15.0099,-19.6583,-14.0333] },
            { method: 'bezierCurveTo', data: [-19.4096,-13.219,-17.885,-11.5296,-17.0615,-10.891] },
            { method: 'bezierCurveTo', data: [-16.2862,-10.2898,-15.0585,-9.9392,-14,-9.9396] },
            { method: 'bezierCurveTo', data: [-12.9789,-9.94,-11.8564,-10.313,-10.9385,-10.891] },
            { method: 'bezierCurveTo', data: [-9.8114,-11.6009,-8.6797,-13.0698,-8.3417,-14.0333] },
            { method: 'bezierCurveTo', data: [-7.9685,-15.0971,-7.6509,-15.982,-6.609,-15.999] },
            { method: 'bezierCurveTo', data: [-6.2414,-16.005,-5.9979,-16.0585,-5.9979,-16] },
            { method: 'bezierCurveTo', data: [-5.9979,-14.9789,-6.1939,-13.9407,-6.609,-12.9385] },
            { method: 'moveTo', data: [21.391,-12.9385] },
            { method: 'bezierCurveTo', data: [20.9759,-11.9364,20.3807,-11.0634,19.6583,-10.3417] },
            { method: 'bezierCurveTo', data: [18.9096,-9.5935,18.0242,-9.0078,17.0615,-8.609] },
            { method: 'bezierCurveTo', data: [16.0987,-8.2102,15.0585,-7.9983,14,-7.9979] },
            { method: 'bezierCurveTo', data: [12.9789,-7.9975,11.9407,-8.1939,10.9385,-8.609] },
            { method: 'bezierCurveTo', data: [9.9364,-9.0241,9.0634,-9.6193,8.3417,-10.3417] },
            { method: 'bezierCurveTo', data: [7.5935,-11.0904,7.0078,-11.9758,6.609,-12.9385] },
            { method: 'bezierCurveTo', data: [6.2102,-13.9013,5.9979,-14.9415,5.9979,-16] },
            { method: 'bezierCurveTo', data: [5.9979,-16.0524,6.3189,-15.9968,6.609,-15.999] },
            { method: 'bezierCurveTo', data: [7.6937,-16.007,8.0433,-15.0099,8.3417,-14.0333] },
            { method: 'bezierCurveTo', data: [8.5904,-13.219,10.115,-11.5296,10.9385,-10.891] },
            { method: 'bezierCurveTo', data: [11.7138,-10.2898,12.9415,-9.9392,14,-9.9396] },
            { method: 'bezierCurveTo', data: [15.0211,-9.94,16.1436,-10.313,17.0615,-10.891] },
            { method: 'bezierCurveTo', data: [18.1886,-11.6009,19.3203,-13.0698,19.6583,-14.0333] },
            { method: 'bezierCurveTo', data: [20.0315,-15.0971,20.3491,-15.982,21.391,-15.999] },
            { method: 'bezierCurveTo', data: [21.7586,-16.005,22.0021,-16.0585,22.0021,-16] },
            { method: 'bezierCurveTo', data: [22.0021,-14.9789,21.8061,-13.9407,21.391,-12.9385] }
          ],
          bottom: [
            { method: 'moveTo', data: [-6.6090,-16.001] },
            { method: 'bezierCurveTo', data: [-7.6936,-15.992,-7.9943,-17.1259,-8.3417,-17.9667] },
            { method: 'bezierCurveTo', data: [-8.7458,-18.945,-10.1945,-20.539,-10.9385,-21.0777] },
            { method: 'bezierCurveTo', data: [-11.7826,-21.6889,-12.9415,-22.0608,-14,-22.0604] },
            { method: 'bezierCurveTo', data: [-15.0211,-22.06,-16.1843,-21.7251,-17.0615,-21.0777] },
            { method: 'bezierCurveTo', data: [-17.9342,-20.4336,-19.1241,-18.9006,-19.6583,-17.9667] },
            { method: 'bezierCurveTo', data: [-20.184,-17.0479,-20.3495,-16.0357,-21.391,-16.001] },
            { method: 'bezierCurveTo', data: [-21.5711,-15.995,-22.0021,-15.879,-22.0021,-16] },
            { method: 'bezierCurveTo', data: [-22.0021,-17.0211,-21.8061,-18.0593,-21.391,-19.0615] },
            { method: 'bezierCurveTo', data: [-20.9759,-20.0636,-20.3807,-20.9366,-19.6583,-21.6583] },
            { method: 'bezierCurveTo', data: [-18.9096,-22.4065,-18.0242,-22.9922,-17.0615,-23.391] },
            { method: 'bezierCurveTo', data: [-16.0987,-23.7898,-15.0585,-24.0017,-14,-24.0021] },
            { method: 'bezierCurveTo', data: [-12.9789,-24.0025,-11.9407,-23.8061,-10.9385,-23.391] },
            { method: 'bezierCurveTo', data: [-9.9364,-22.9759,-9.0634,-22.3807,-8.3417,-21.6583] },
            { method: 'bezierCurveTo', data: [-7.5935,-20.9096,-7.0078,-20.0242,-6.609,-19.0615] },
            { method: 'bezierCurveTo', data: [-6.2102,-18.0987,-5.9979,-17.0585,-5.9979,-16] },
            { method: 'bezierCurveTo', data: [-5.9979,-15.9164,-6.3501,-16.0032,-6.609,-16.001] },
            { method: 'moveTo', data: [21.391,-16.001] },
            { method: 'bezierCurveTo', data: [20.3064,-15.992,20.0057,-17.1259,19.6583,-17.9667] },
            { method: 'bezierCurveTo', data: [19.2542,-18.945,17.8055,-20.539,17.0615,-21.0777] },
            { method: 'bezierCurveTo', data: [16.2174,-21.6889,15.0585,-22.0608,14,-22.0604] },
            { method: 'bezierCurveTo', data: [12.9789,-22.06,11.8157,-21.7251,10.9385,-21.0777] },
            { method: 'bezierCurveTo', data: [10.0658,-20.4336,8.8759,-18.9006,8.3417,-17.9667] },
            { method: 'bezierCurveTo', data: [7.816,-17.0479,7.6505,-16.0357,6.609,-16.001] },
            { method: 'bezierCurveTo', data: [6.4289,-15.995,5.9979,-15.879,5.9979,-16] },
            { method: 'bezierCurveTo', data: [5.9979,-17.0211,6.1939,-18.0593,6.609,-19.0615] },
            { method: 'bezierCurveTo', data: [7.0241,-20.0636,7.6193,-20.9366,8.3417,-21.6583] },
            { method: 'bezierCurveTo', data: [9.0904,-22.4065,9.9758,-22.9922,10.9385,-23.391] },
            { method: 'bezierCurveTo', data: [11.9013,-23.7898,12.9415,-24.0017,14,-24.0021] },
            { method: 'bezierCurveTo', data: [15.0211,-24.0025,16.0593,-23.8061,17.0615,-23.391] },
            { method: 'bezierCurveTo', data: [18.0636,-22.9759,18.9366,-22.3807,19.6583,-21.6583] },
            { method: 'bezierCurveTo', data: [20.4065,-20.9096,20.9922,-20.0242,21.391,-19.0615] },
            { method: 'bezierCurveTo', data: [21.7898,-18.0987,22.0021,-17.0585,22.0021,-16] },
            { method: 'bezierCurveTo', data: [22.0021,-15.9164,21.6499,-16.0032,21.391,-16.001] }
          ],
          size: [
            { method: 'moveTo', data: [-5.4199,-11.9282] },
            { method: 'bezierCurveTo', data: [-5.972,-10.5954,-6.7637,-9.4344,-7.7244,-8.4744] },
            { method: 'bezierCurveTo', data: [-8.7203,-7.4793,-9.8978,-6.7003,-11.1782,-6.1699] },
            { method: 'bezierCurveTo', data: [-12.4587,-5.6395,-13.8422,-5.3578,-15.25,-5.3572] },
            { method: 'bezierCurveTo', data: [-16.6081,-5.3567,-17.9889,-5.6178,-19.3218,-6.1699] },
            { method: 'bezierCurveTo', data: [-20.6546,-6.722,-21.8156,-7.5137,-22.7756,-8.4744] },
            { method: 'bezierCurveTo', data: [-23.7707,-9.4703,-24.5497,-10.6478,-25.0801,-11.9282] },
            { method: 'bezierCurveTo', data: [-25.6105,-13.2087,-25.8922,-14.5922,-25.8928,-16] },
            { method: 'bezierCurveTo', data: [-25.8933,-17.3581,-25.6322,-18.7389,-25.0801,-20.0718] },
            { method: 'bezierCurveTo', data: [-24.528,-21.4046,-23.7363,-22.5656,-22.7756,-23.5256] },
            { method: 'bezierCurveTo', data: [-21.7797,-24.5207,-20.6022,-25.2997,-19.3218,-25.8301] },
            { method: 'bezierCurveTo', data: [-18.0413,-26.3605,-16.6578,-26.6422,-15.25,-26.6428] },
            { method: 'bezierCurveTo', data: [-13.8919,-26.6433,-12.5111,-26.3822,-11.1782,-25.8301] },
            { method: 'bezierCurveTo', data: [-9.8454,-25.278,-8.6844,-24.4863,-7.7244,-23.5256] },
            { method: 'bezierCurveTo', data: [-6.7293,-22.5297,-5.9503,-21.3522,-5.4199,-20.0718] },
            { method: 'bezierCurveTo', data: [-4.8895,-18.7913,-4.6078,-17.4078,-4.6072,-16] },
            { method: 'bezierCurveTo', data: [-4.6067,-14.6419,-4.8678,-13.2611,-5.4199,-11.9282] },
            { method: 'moveTo', data: [25.0801,-11.9282] },
            { method: 'bezierCurveTo', data: [24.528,-10.5954,23.7363,-9.4344,22.7756,-8.4744] },
            { method: 'bezierCurveTo', data: [21.7797,-7.4793,20.6022,-6.7003,19.3218,-6.1699] },
            { method: 'bezierCurveTo', data: [18.0413,-5.6395,16.6578,-5.3578,15.25,-5.3572] },
            { method: 'bezierCurveTo', data: [13.8919,-5.3567,12.5111,-5.6178,11.1782,-6.1699] },
            { method: 'bezierCurveTo', data: [9.8454,-6.722,8.6844,-7.5137,7.7244,-8.4744] },
            { method: 'bezierCurveTo', data: [6.7293,-9.4703,5.9503,-10.6478,5.4199,-11.9282] },
            { method: 'bezierCurveTo', data: [4.8895,-13.2087,4.6078,-14.5922,4.6072,-16] },
            { method: 'bezierCurveTo', data: [4.6067,-17.3581,4.8678,-18.7389,5.4199,-20.0718] },
            { method: 'bezierCurveTo', data: [5.972,-21.4046,6.7637,-22.5656,7.7244,-23.5256] },
            { method: 'bezierCurveTo', data: [8.7203,-24.5207,9.8978,-25.2997,11.1782,-25.8301] },
            { method: 'bezierCurveTo', data: [12.4587,-26.3605,13.8422,-26.6422,15.25,-26.6428] },
            { method: 'bezierCurveTo', data: [16.6081,-26.6433,17.9889,-26.3822,19.3218,-25.8301] },
            { method: 'bezierCurveTo', data: [20.6546,-25.278,21.8156,-24.4863,22.7756,-23.5256] },
            { method: 'bezierCurveTo', data: [23.7707,-22.5297,24.5497,-21.3522,25.0801,-20.0718] },
            { method: 'bezierCurveTo', data: [25.6105,-18.7913,25.8922,-17.4078,25.8928,-16] },
            { method: 'bezierCurveTo', data: [25.8933,-14.6419,25.6322,-13.2611,25.0801,-11.9282] },
          ]
        };
    
    
    // Functions for handling vectors and cartesian coordinates.
    
    function vect(x, y, fn) {
      // Converts [x, y] coordinate to [distance, angle] vector,
      // normalised to upwards, clockwise, angle 0-1.
      
      var d = 0;
      var a = 0;
      
      // Flip y to normalise to upwards vector
      y = y * -1;
      
      // Detect quadrant and work out vector
      if (y == 0) {
        if (x < 0)  { a = 0.75; d = -x; } 
        else        { a = 0.25; d = x;  }
      }
      else if (y < 0) {
        if (x == 0) { a = 0.5;  d = -y; }
        else        { a = (Math.atan(x/y) / (2*Math.PI)) + 0.5; d = Math.sqrt(x*x + y*y); }
      }
      else if (y > 0) {
        if (x == 0) { a = 0;    d = y; }
        else        { a = (x > 0) ? Math.atan(x/y) / (2*Math.PI) : 1 + Math.atan(x/y) / (2*Math.PI) ; d = Math.sqrt(x*x + y*y); }
      }
      
      return fn(a, d);
    }
    
    function cart(a, d, fn) {
      // Converts [distance, angle] vector to [x, y] coordinates,
      // normalised to upwards, clockwise, angle 0-1.
      
      var x = 0;
      var y = 0;
      
      // Set angle into range 0-1
      if ( a<0 || a>=1 ) { a = a - Math.floor(a); }
      
      // Work out cartesian coordinates
      if      (a == 0)    { y = d; }
      else if (a == 0.25) { x = d; }
      else if (a == 0.5)  { y = -d; }
      else if (a == 0.75) { x = -d; }
      else {
        a = 2 * Math.PI * a;
        x = Math.sin(a) * d;
        y = Math.cos(a) * d;
      }
      
      // Flip y to normalise to downwards coords
      y = y * -1;
      
      return fn(x, y);
    }
    
    // Process paths
    
    function calcDeformData( dataA, dataB ){
      var i = dataA.length,
          deformData = [];
      
      while ( i-- ) {
        
        // Catch datasets that don't match up
        if ( dataA[i] === undefined || dataB[i] === undefined ) {
          console.log('Datasets do not match');
          return;
        }
        
        deformData[i] = dataB[i] - dataA[i];
      }
      
      return deformData;
    }
    
    function calcDeformPath( pathA, pathB, fn ){
      var i = -1,
          l = pathA.length,
          deformPath = [];
      
      while ( ++i < l ) {
        
        // Catch paths that don't match up
        if ( pathA[i].method !== pathB[i].method ) {
          console.log('Points in path and deform path do not match');
          return;
        }
        
        calcDeformData( pathA[i].data, pathB[i].data, function( deformData ){
          deformPath[i] = deformData;
        });
      }
      
      fn( deformPath );
    }
    
    // Really just doing a forEach...
    
    function processPath( path, fn ){
      var i = -1,
          l = path.length,
          out = [];
      
      while ( ++i < l ) {
        out[i] = fn( i, path[i] );
      }
      
      return out;
    }
    
    // Translate to vectors
    
    function calcVectorData( data ){
      var output = [],
          i = data.length - 1;
      
      while ( i > 0 ) {
        
        vect(data[i-1], data[i], function(a, d){
          output[i-1] = a;
          output[i] = d;
        });
        
        i = i-2;
      }
      
      return output;
    }


    function cartData( data, fn ){
      var i = data.length - 1;
      
      while ( i > 0 ) {
        
        cart(data[i-1], data[i], function(x, y){
          data[i-1] = x;
          data[i] = y;
        });
        
        i = i-2;
      }
      
      return fn( data );
    }
    
    function calcMergeData( dataA, dataB, factor ){
      var output = [],
          i = dataB.length;
      
      while ( i-- ) {
        output[i] = dataA[i] + (factor * dataB[i]);
      }
      
      return output;
    }

    function mergeData( dataA, dataB, fn ){
      var output = [],
          i = dataA.length;
      
      while ( i-- ) {
        output[i] = dataA[i] + dataB[i];
      }
      
      return fn( output );
    }
    
    
    // RUN
    
    var vectorPath = processPath( path, function( i, obj ){
      var vectorData = calcVectorData( obj.data );
      
      return vectorData;
    });
    
    //var deformPath = processPath( eyesTopLid, function( i, obj ){
    //  var vectorData = calcVectorData( obj.data );
    //  var deformData = calcDeformData( vectorPath[i], vectorData );
    //  
    //  return deformData;
    //});
    
    var key, deforms = {};
    
    for (key in paths) {
      deforms[key] = processPath( paths[key], function( i, obj ){
        var vectorData = calcVectorData( obj.data );
        var deformData = calcDeformData( vectorPath[i], vectorData );
      
        return deformData;
      });
    }
    
    var wisp = Object.create({
      init: function( width, height ){
        var node = document.createElement('canvas');
        
        node.setAttribute('width', width);
        node.setAttribute('height', height);
        
        this.saveLevel = 0;
        this.node = node;
        this.width = width;
        this.height = height;
        this.ctx = node.getContext('2d'); 
        
        return this;
      },
      translate: function(x, y){
        this.ctx.save();
        this.saveLevel++;
        this.ctx.translate(x, y);
        return this;
      },
      scale: function(x, y){
        this.ctx.save();
        this.saveLevel++;
        this.ctx.scale(x, y);
        return this;
      },
      clear: function(){
        while (this.saveLevel) {
          this.ctx.restore();
          this.saveLevel--;
        }
        this.ctx.clearRect( 0, 0, this.width, this.height );
        
        return this;
      },
      plot: function( path ){
        var ctx = this.ctx,
            i = -1,
            l = path.length;
        
        while ( ++i < l ){
          ctx[ path[i].method ].apply( ctx, path[i].data );
        }
        
        return this;
      },
      draw: function( path, options ){
        var ctx = this.ctx ;
        
        ctx.save();
        
        // Convert this to get style from options
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        
        ctx.translate(32, 32);
        ctx.scale(2, 2);
        
        ctx.beginPath();
				this.plot( path );
        ctx.closePath();
        
        ctx.fill();
        
        ctx.restore();
        
        return this;
      }
    });
    
    wisp.drawBody = function(){
      var ctx = this.ctx;
      
      ctx.save();
      
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      
      ctx.beginPath();
			this.plot(body);
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
      
      return this;
    };
    
    wisp.drawEyes = function( options ){
      var ctx = this.ctx;
      
      ctx.save();
      
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0,0,0,0)';
      
      ctx.beginPath();
      
      processPath( path, function( i, obj ){
        var vectorData = vectorPath[i],
            deformData = [0,0,0,0,0,0],
            key;
        
        for (key in deforms) {
          if (options[key]) {
            deformData = calcMergeData( deformData, deforms[key][i], options[key] );
          }
        }
        
        mergeData( vectorData, deformData, function(data){
          cartData(data, function(data){
            ctx[ path[i].method ].apply( ctx, data );
          });
        });
      });
      
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
      
      return this;
    };
    
    jQuery(document).ready(function(){
      
      wisp
      .init( 240, 240 )
      .translate(32, 32)
      .scale(3,3)
      .drawBody()
      .translate(60, 36)
      .scale(0.70, 0.70)
      .drawEyes({});
      
      jQuery('body').prepend( wisp.node );
      
    });
