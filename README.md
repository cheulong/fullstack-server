# Fullstack-server

## Step 1: Ansible
### Config Server


In this scenario, we have:
- 3 worker-nodes to host our k8s cluster for fullstack web service
    - worker-node-01 
    - worker-node-02 
    - worker-node-03

This step is to setup and install dependencies to each server via ansible.
Key to take away from this step:
- understand ansible folder structure
- be able to config servers according to tags (worker-node, worker-node-01)

Task1: create ssh key in master node

``` 
ssh-keygen -C "cheulong-pc"
```

Task2: copy ssh key from master to worker node

```
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.10
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.11
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.12
```
(optional) create .ssh/config
```
Host worker01
    Hostname 192.168.230.10
    User cheulong

Host worker02
    Hostname 192.168.230.11
    User cheulong

Host worker03
    Hostname 192.168.230.12
    User cheulong
```
test it
```
ssh worker01
```
