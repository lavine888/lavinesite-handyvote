import type { Group } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { BakedModel } from './BakedModel';
import type { LoadedModel, LoadedTexture } from './types';

export class Computer extends BakedModel {
  private logoBackground: THREE.Mesh | null = null;
  private logo: THREE.Mesh | null = null;

  constructor(model: LoadedModel, tweens: Group) {
    super(model, tweens, 900);
  }

  /** Places the personal mark on the monitor's lower-left bezel. */
  addLogo(texture: LoadedTexture): void {
    const bezel = this.object.getObjectByName('monitor_base');
    if (!(bezel instanceof THREE.Mesh)) return;

    if (!this.logoBackground) {
      // The baked bezel material is transparent, so keep the decal in the
      // same queue and draw it above the original atlas logo.
      const backingMaterial = new THREE.MeshBasicMaterial({
        color: 0x202020,
        opacity: 0.92,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });
      this.logoBackground = new THREE.Mesh(
        new THREE.PlaneGeometry(0.36, 0.16),
        backingMaterial,
      );
      this.logoBackground.position.set(-0.6, 0.44, 0.7);
      this.logoBackground.renderOrder = 10;
      bezel.add(this.logoBackground);
    }

    if (!this.logo) {
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
        alphaTest: 0.04,
      });
      this.logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 0.3),
        logoMaterial,
      );
      this.logo.position.set(-0.6, 0.44, 0.705);
      this.logo.renderOrder = 11;
      bezel.add(this.logo);
      return;
    }

    const material = this.logo.material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.map = texture;
      material.needsUpdate = true;
    }
  }
}
