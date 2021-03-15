pragma solidity ^0.4.18;

contract Token {

     // 현재까지 공급된 토큰수
    function totalSupply() constant returns (uint256 supply) {}
    // _owner가 보유한 토큰잔액을 반환
    function balanceOf(address _owner) constant returns (uint256 balance) {}

    // 수신자(_to) 로 해당금액(_value)를 송금. 송금이 성공하면 TRUE를 반환하고, 실패하면 FALSE를 반환.
    function transfer(address _to, uint256 _value) returns (bool success) {}

    //송신자(_from)주소에서 수신자(_to) 주소로 해당금액(_value)을 송금. 송금이 성공하면 TRUE를 반환하고, 실패하면 FALSE를 반환.       
    // transferFrom이 성공하려면 먼저 approve 인터페이스를 사용하여 일정금액을 인출할수 있도록 허락하여야 함.
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {}

    // 송신자(msg.sender)가 보유한 토큰에서 일정금액(_value)만큼의 토큰을 인출할수 있는 권한을 수신자(_spender)에게 부여.
    function approve(address _spender, uint256 _value) returns (bool success) {}

    // 토큰 소유자(_owner)가 토큰 수신자(_spender)에게 인출을 허락한 토큰이 얼마인지를 반환.
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}

contract StandardToken is Token {

    function transfer(address _to, uint256 _value) returns (bool success) {
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;
}



contract phonychain is StandardToken{
  address public owner;
 string public name;                  
    uint8 public decimals;                
    string public symbol;       
  
  function phonychain(){
      balances[msg.sender] = 10000000000;
      name = "PhonyChain";
      symbol = "PN";
      decimals = 0;
  }

}
