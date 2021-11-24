<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-20 10:05:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-24 14:18:01
-->
```
      <MinimePillow
        :config="config"
        language="de"
        :isManagementUse="false"
        :sizeActiveName="sizeActiveName"
        :backgroundActiveName="backgroundActiveName"
        v-if="visible"
        @close="visible = false"
        @complete="complete"
      />
```

```
import MinimePillow from "minime-pillow";
import "minime-pillow/dist/style.css";
```