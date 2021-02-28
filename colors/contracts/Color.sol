pragma solidity 0.5.7;

import '@openzeppelin/contracts/token/ERC721/ERC721Full.sol';

contract Color is ERC721Full {

  bytes3[] public colors;
  mapping(bytes3 => bool) private _colorExists;

  constructor() ERC721Full("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  function mint(bytes3 _color) public {
    require(!_colorExists[_color], "color exists");
    uint _id = colors.push(_color);
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }
}