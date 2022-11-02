const { ethers } = require("hardhat");

async function signMessage(signer, message) {
    return await signer.signMessage(ethers.utils.arrayify(message));
}

function splitSignature_r_s_v(signature) {
    const splittedSignature = ethers.utils.splitSignature(signature);
    return {
        r: splittedSignature.r,
        s: splittedSignature.s,
        v: splittedSignature.v
    };
}

function splitSignature_r_vs(signature) {
    const splittedSignature = ethers.utils.splitSignature(signature);
    return {
        r: splittedSignature.r,
        vs: splittedSignature._vs
    };
}

async function signValues(signer, types = [], values = []) {
    const message = ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.solidityPack(types, values)]);

    return await signMessage(signer, message);
}

async function signValues_r_s_v(signer, types = [], values = []) {
    const message = ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.solidityPack(types, values)]);

    const signature = await signMessage(signer, message);
    return splitSignature_r_s_v(signature);
}

async function signValues_r_vs(signer, types = [], values = []) {
    const message = ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.solidityPack(types, values)]);

    const signature = await signMessage(signer, message);
    return splitSignature_r_vs(signature);
}

exports.signMessage = signMessage;
exports.splitSignature_r_s_v = splitSignature_r_s_v;
exports.splitSignature_r_vs = splitSignature_r_vs;

exports.signValues = signValues;
exports.signValues_r_s_v = signValues_r_s_v;
exports.signValues_r_vs = signValues_r_vs;
