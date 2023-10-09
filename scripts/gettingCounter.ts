import { toNano } from 'ton-core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const helloWorld = provider.open(await HelloWorld.fromInit(54324n));

    const counter = await helloWorld.getCounter();
    const id = await helloWorld.getId();

    console.log(`Counter - ${counter}; Id - ${id}`);
}
