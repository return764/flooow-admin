project: flooow


## Tech
- [ ] add unit test for code

## Process
- [X] support logic for node&edge deletion
- [X] showing action running status
- [X] support node options form
- [X] add node name
- [ ] could modify action name
- [X] could delete one graph
- [X] support multiple graph
- [ ] support graph list pagination
- [X] support action options input type
- [X] support socket resubscribe
- [ ] support preview one action result

## Refactor
- [X] combine Node&Edge creation logic
- [X] refactor DrawPanel component, split register logic to others file
- [ ] use Drawer instead of NodeOptionsContainer


## Bug
- [ ] fix multiple shape move
- [X] fix the socket reconnect logic
- [X] render blank page when DrawPanel unmount
- [X] can't auto subscribe socket when first enter DrawPanel Page, only refresh page
