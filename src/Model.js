import React, {useRef} from "react";
import {useGLTF} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";

export const Model = (props) => {
	// const prefix = "/projects/3D/cap-configurator";
	const prefix = "";
	const model = prefix + '/baseball_cap.glb',
	 { nodes, materials } = useGLTF(model),
	 modelRef = useRef();
	
	useFrame(({ clock }) => {
	  if(modelRef.current) {
		  // modelRef.current.position.y = 10 * Math.sin(delta)
		  modelRef.current.rotation.y+= .01*Math.sin(clock.getElapsedTime())
		  modelRef.current.position.y = 1.2*Math.sin(clock.getElapsedTime())
	  }
	})
	
	const {
		colorCrown,
		colorBrim,
		colorTop,
		colorStrip,
		colorUnder,
	} = props
	
	return (
		<group ref={modelRef}  {...props} dispose={null}>
			<group rotation={[-Math.PI / 2, 0, 0]}>
				<group rotation={[Math.PI / 2, 0, 0]}>
					<mesh castShadow material-color={colorTop} geometry={nodes.baseballCap.geometry} material={materials.baseballCap} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />
					<mesh castShadow material-color={colorBrim} geometry={nodes.baseballCap_1.geometry} material={materials.baseballCap.clone()} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />
					<mesh castShadow material-color={colorStrip} geometry={nodes.plastic.geometry} material={materials.plastic} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />*/}
					<mesh castShadow material-color={colorStrip} geometry={nodes.plastic_1.geometry} material={materials.plastic.clone()} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />
					<mesh castShadow material-color={colorUnder} geometry={nodes.baseballCap_2.geometry} material={materials.baseballCap.clone()} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />
					<mesh castShadow material-color={colorCrown} geometry={nodes.baseballCap_3.geometry} material={materials.baseballCap.clone()} position={[0.005, -2.9, -11.842]} rotation={[-0.161, 0, 0]} scale={20.118} />
				</group>
			</group>
		</group>
	)
}