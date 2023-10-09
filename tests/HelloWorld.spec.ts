import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton-community/test-utils';

describe('HelloWorld', () => {
    let blockchain: Blockchain;
    let helloWorld: SandboxContract<HelloWorld>;
    let deployer: SandboxContract<TreasuryContract>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(await HelloWorld.fromInit(1000n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and helloWorld are ready to use
    });

    it('should increase', async () => {
        const counterBefore = await helloWorld.getCounter();

        console.log('counterBefore - ', counterBefore);

        await helloWorld.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            'increment'
        );

        const counterAfter = await helloWorld.getCounter();
        console.log('counterAfter - ', counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    });

    it('should increase with amount', async () => {
        const counterBefore = await helloWorld.getCounter();

        console.log('counterBefore - ', counterBefore);

        const amount = 5n;

        await helloWorld.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'Add',
                amount: amount,
            }
        );

        const counterAfter = await helloWorld.getCounter();
        console.log('counterAfter - ', counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    });
});
