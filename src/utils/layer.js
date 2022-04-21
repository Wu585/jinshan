import { s3mUrlHashmap } from "@/assets/js/s3m-url";
import axios from "axios";

export function findLayer(name) {
  return viewer.scene.layers.find(name);
}

export async function findAllLayersOfOneDataset(name) {
  const s3mNameArr = [];
  const s3mItem = s3mUrlHashmap.find((item) => name === item.name);
  for (let i = 0; i < s3mItem.urls.length; i++) {
    const { data } = await axios.get(s3mItem.urls[i]);
    data.forEach((obj) => {
      s3mNameArr.push(obj.name);
    });
  }
  return s3mNameArr;
}

export async function setAllLayersVisibleOfOneDataset(name, visible) {
  const s3mNameArr = await findAllLayersOfOneDataset(name);
  s3mNameArr.forEach(
    (name) => (viewer.scene.layers.find(name).visible = visible)
  );
}

export function findMapLayer(name) {
  return viewer.imageryLayers._layers.find(
    (layer) => layer._imageryProvider.name === name
  );
}
