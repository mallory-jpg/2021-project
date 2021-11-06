// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";
// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";

// contract inherits from standards NFT contract ERC721
contract NFTGame is ERC721 {
  // holding character attributes in a struct
  struct CharacterAttributes {
      uint characterIndex;
      string name;
      string imageURI;        
      uint hp;
      uint maxHp;
      uint attackDamage;
    }
    // _tokenID = NFT's unique identifier, which is being incremented here 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // array holds default character data
    CharacterAttributes[] defaultCharacters;

    // map nft's tokenId to that NFT's attributes
    // store state of player's NFTs in nftHolderAttributes
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // map from address to the NFTs tokenId. 
    // stores the owner of the NFT to reference later
    mapping(address => uint256) public nftHolders;

    constructor(
      string[] memory characterNames,
      string[] memory characterImageURIs,
      uint[] memory characterHp,
      uint[] memory characterAttackDmg
      // ERC721(<name>, <symbol>) creates a special identifier token for the NFTs 
      // ERC721 is the NFT standard 
  ) 
      ERC721("NewAge","$KNOW") 
  {
    // looping through characters and saving values to contract for later use when minting the NFT
      for(uint i = 0; i < characterNames.length; i += 1) {
        defaultCharacters.push(CharacterAttributes({
            characterIndex: i,
            name: characterNames[i],
            imageURI: characterImageURIs[i],
            hp: characterHp[i],
            maxHp: characterHp[i],
            attackDamage: characterAttackDmg[i]
        }));

        CharacterAttributes memory c = defaultCharacters[i];
        console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
      }
      // increment tokenIds with first NFT having an ID of 1
      _tokenIds.increment();
    }
    // function returns minted NFT based on character index, which tells us which character the user wants
    function mintCharacterNFT(uint _characterIndex) external {
      // Get current tokenId (starting at 1) - a state variable
      // newItemId is the ID of the NFT itself
      uint256 newItemId = _tokenIds.current();

      // Assigns tokenId to caller's wallet address
      // msg.sender is a Solidity variable to access public address of person calling the contract - for authentification
      _safeMint(msg.sender, newItemId);

      // Map tokenId to their character's attributes
      nftHolderAttributes[newItemId] = CharacterAttributes({
        characterIndex: _characterIndex,
        name: defaultCharacters[_characterIndex].name,
        imageURI: defaultCharacters[_characterIndex].imageURI,
        hp: defaultCharacters[_characterIndex].hp,
        maxHp: defaultCharacters[_characterIndex].hp,
        attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

      console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
    
      // See NFT owner
      nftHolders[msg.sender] = newItemId;

      // Increment the tokenId for the next person that uses it
      _tokenIds.increment();
  }
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
      CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId]; // retrieves specific NFT data using _tokenID

      string memory strHp = Strings.toString(charAttributes.hp);
      string memory strMaxHp = Strings.toString(charAttributes.maxHp);
      string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

      string memory json = Base64.encode(
        bytes(
          string(
            abi.encodePacked(
              '{"name": "',
              charAttributes.name,
              ' -- NFT #: ',
              Strings.toString(_tokenId),
              '", "description": "This is an NFT for the game Into the Metaverse!", "image": "',
              charAttributes.imageURI,
              '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
              strAttackDamage,'} ]}'
            )
          )
        )
      );

      string memory output = string(
        abi.encodePacked("data:application/json;base64,", json)
      );
      
      return output;
  }
}