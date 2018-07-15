# JMMSR

Each null value can be completely ommited.

## Schema
```
{
services: [
            {name: service(),
             service_dir: path(),
             service_executable: path(),
             containerized: boolean(),
             requirements: {
                             os: [os()], 
                             RAM: non_neg_integer() | null,
                             HDD: non_neg_integer() | null,
                             available_machines: [machine_id()] // empty means "every machine"
                           }
             }
            ],
machines: [
           {name: string() | null,
            id: machine_id(),
            ip: ip() | null,  // in case of round robin DNS - random ip will be taken
            domain: domain_name() | null,
            os: os()
           }
          ],
connections: [
                {service_from: service(),
                 service_to: service(),
                 port: port()
                }
             ],
config: {metrics: [metric_name()],
         persist: boolean(),
         persist_machine: machine_id() | null,
         pilot_machine: machine_id()
        }
live_metrics: [
                {for_machine: boolean(),
                 service_name: service_name() | null,
                 machine_id: machine_id() | null,
                 metric: metric_name(),
                 value: number(),
                 unit: unit()
                }
              ]
}
```

### Types
```
service() :: string() // case insesitive, no whitespaces
path() :: string()
os() :: "linux" | "debian"
machine_id() :: integer()
ip() :: string() // ipv4 address in dot notation
domain_name() :: string() // rfc1123 compliant
metric_name() :: string() // TODO: we need to specify them here
unit() :: "%" | memory_unit() | time_unit()
memory_unit() :: "kb" | "mb" | "gb" ...
time_unit() :: "ns" | "ms" | "min" | "h" ...
```
