const CONTRACT_ADDRESS = '0xA50650C21299F7908360A9EfA9365DCae17B9899';

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };