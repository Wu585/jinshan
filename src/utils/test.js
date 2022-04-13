import {
  findAllParentTreeNode,
  findCameraInfoByIndexCode,
  getAllPointInfo,
  gps84_to_cd,
  updatePointInfo
} from "@/apis/information";
import { transformGeometricPosition } from "@/utils/view";

export async function test() {
  const { data } = await getAllPointInfo();
  const { list } = data.data;
  console.log(list);
  for (let i = 0; i < list.length; i++) {
    const { id, indexCode } = list[i];
    if (!list[i].x) {
      console.log("i:", i);
      const { data: res1 } = await findCameraInfoByIndexCode(indexCode);
      if (res1.success) {
        const { name: cameraName } = res1.data.data[0];
        const { longitude, latitude, treeNodeIndexcode } = res1.data.data[0];
        try {
          const res2 = await gps84_to_cd(longitude, latitude);
          const {
            longitude: lng,
            latitude: lat
          } = transformGeometricPosition(+res2.data.data.lng, +res2.data.data.lat);
          const res3 = await findAllParentTreeNode(treeNodeIndexcode);
          if (res3.data.success) {
            const pointArray = res3.data.data.data;
            const streetName = pointArray.find(point => point.parentIndexCode === pointArray.find(point => point.name === "街镇")?.indexCode)?.name;
            if (streetName) {
              console.log("has street");
              updatePointInfo({
                id,
                x: lng.toString(),
                y: lat.toString(),
                streetTown: streetName
              });
            } else {
              console.log("no street");
              updatePointInfo({
                id,
                x: lng.toString(),
                y: lat.toString()
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}
